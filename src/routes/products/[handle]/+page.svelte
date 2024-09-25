<script>
	import { browser } from '$app/environment';
	import { selectedSize as selectedSizeStore } from './../../../stores/filter.js';
	import { isCartUpdated } from './../../../stores/cart.js';
	import { isQuickShopClosed } from '../../../stores/quickShop.js';
	import { onMount } from 'svelte';
	import QuickShop from '../../../components/QuickShop.svelte';
	// import function to register Swiper custom elements
	import { register } from 'swiper/element/bundle';
	// register Swiper custom elements
	register();

	export let data;
	$: product = data.product?.data.product;
	$: yotpoId = Number(product.id.split('/').pop());
	$: swatches = [{ data: { product: product } }, ...data.swatches];
	$: selectedImage = product.featuredImage?.url;
	$: collectionProducts = data.collection;
	let selectedSize;
	let selecetdColor;
	let merchandiseId;
	let available = false;
	let quickShopProduct;

	$: isQuickShopClosedVal = true;
	isQuickShopClosed.subscribe((value) => {
		isQuickShopClosedVal = value;
	});

	$: isOpen = false;
	$: urls = product.media.nodes.map((media) => {
		return media.previewImage.url;
	});
	$: availableVariants = product.variants.nodes.map((variant) => {
		available = false;
		let vari = {
			Size: null,
			Color: null,
			id: null
		};

		if (variant.availableForSale) {
			variant.selectedOptions.forEach((option) => {
				if (option.name == 'Size') {
					vari = {
						Size: option.value,
						id: variant.id
					};
				}
			});
		}
		return vari;
	});
	$: sizes = [];
	$: variants = product.variants.nodes;
	let size = [];
	$: for (let i = 0; i < variants.length; i++) {
		if (i == 0) {
			sizes = sizes.splice(0);
		}
		variants[i].selectedOptions.map((option) => {
			if (option.name !== 'Title' && option.name == 'Size') {
				const obj = {
					val: option.value,
					isAvailable: variants[i].availableForSale
				};
				if (!size.includes(obj)) {
					size.push(obj);
				}
			}
		});
		sizes = size;
	}
	$: colors = [];
	let color = [];
	$: for (let i = 0; i < variants.length; i++) {
		if (i == 0) {
			colors = colors.splice(0);
		}
		variants[i].selectedOptions.map((option) => {
			if (option.name !== 'Title' && option.name == 'Color') {
				if (!color.includes(option.value)) {
					color.push(option.value);
				}
			}
		});
		colors = color;
	}

	$: initialPrice = parseInt(product.priceRange.maxVariantPrice.amount);
	$: price = initialPrice;

	function handleAvailablity() {
		if (selectedSize) {
			available = false;
			availableVariants.map((variant) => {
				if (variant.Size == selectedSize) {
					available = true;
					merchandiseId = variant.id;
				}
			});
		}
	}

	function handleSizeClick(size) {
		if (size.isAvailable) {
			selectedSize = size.val;
			handleAvailablity();
		} else {
			return;
		}
	}

	function handleSizeClickMobile(size) {
		if (size.isAvailable) {
			selectedSize = size.val;
			isOpen = !isOpen;
			const btnGroup = document.querySelector('.btnGroupToggle');
			btnGroup.style.display = 'none';
			const arrow = document.querySelector('.arrow');
			arrow.classList.toggle('rotated');
			const mobileSelectBtn = document.querySelector('.mobileSelectBtn');
			mobileSelectBtn.classList.toggle('mb');
			handleAvailablity();
		} else {
			return;
		}
	}

	async function AddToCart() {
		available = false;
		const res = await fetch('/api/cart', {
			method: 'POST',
			body: JSON.stringify({
				merchandiseId,
				quantity: 1
			})
		});
		selectedSize = null;
		selecetdColor = null;
		const added = await res.json();
		if (added) {
			isCartUpdated.set(true);
		}
	}

	function clear() {
		selectedSize = null;
		selecetdColor = null;
	}

	let activeTab = 'description';
	function setActiveTab(tab) {
		activeTab = tab;
	}

	onMount(() => {
		// swiper element
		const swiperEl = document.querySelector(`.collectionSlider`);

		const swiperParams = {
			slidesPerView: 1,
			spaceBetween: 10,
			navigation: true,
			loop: true,
			breakpoints: {
				480: {
					slidesPerView: 2
				},
				640: {
					slidesPerView: 4
				},
				950: {
					slidesPerView: 5
				}
			},
			on: {
				init() {
					// ...
				}
			}
		};

		if (swiperEl) {
			Object.assign(swiperEl, swiperParams);
			swiperEl.initialize();
		}

		const productGallerySlider = document.querySelector('.productGallerySlider');
		const productGallerySliderParams = {
			loop: false,
			slidesPerView: 'auto',
			navigation: true,
			pagination: false
		};
		if (productGallerySlider) {
			Object.assign(productGallerySlider, productGallerySliderParams);
			productGallerySlider.initialize();
		}

		selectedSizeStore.subscribe((value) => {
			selectedSize = value;
			if (selectedSize != '') {
				handleAvailablity();
			}
		});
	});
</script>

<svelte:head>
	<title>{product.title}</title>
	<link rel="preconnect" href="https://cdn1.stamped.io" />
	<script type="text/javascript" src="https://cdn1.stamped.io/files/widget.min.js"></script>
	<script type="text/javascript">
		//<![CDATA[
		StampedFn.init({ apiKey: '744151be-0796-4097-820c-edc7a7f68a07', sId: '341070' });
		// ]]>
	</script>
</svelte:head>

<div class="container">
	<div class="main">
		<div class="images">
			<div class="mediaImages">
				{#each urls as url}
					<div on:mouseenter={() => (selectedImage = url)} role="button" tabindex="">
						<img
							src={`${url}&width=150`}
							alt="Product"
							class={`mediaImage ${selectedImage == url ? 'selected' : 'notSelected'}`}
						/>
					</div>
				{/each}
			</div>
			<div class="mainImageDiv">
				<img src={`${selectedImage}&width=800`} alt={product.title} class="mainImage" />
			</div>
		</div>
		<div class="mobileImages">
			<swiper-container init="false" class="productGallerySlider">
				{#each urls as url}
					<swiper-slide class="swiperSlide">
						<img src={`${url}&width=800`} alt="Product" class="mobileImage" />
					</swiper-slide>
				{/each}
			</swiper-container>
		</div>
		<div class="data">
			<div class="titleAndPrice">
				<h1 class="title">{product.title}</h1>
				<p class="price">${price}</p>
			</div>
			{#if colors.length > 0}
				<div class="color">
					<p class="colorText">Color:</p>
					<p class="transform">{colors[0]}</p>
				</div>
			{/if}
			{#if swatches.length > 0}
				<div class="swatches">
					{#each swatches as swatch, i}
						<a
							href={`/products/${swatch.data.product?.handle}`}
							on:click={clear}
							data-sveltekit-reload
						>
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div class="swatchDiv">
								<img
									src={`${swatch.data.product?.featuredImage.url}&width=40`}
									alt="Product"
									width="30px"
									height="30px"
									class={`swatch ${i == 0 ? 'borderPink' : ''}`}
								/>
								<div class="swatchModal">
									<div class="imageSwatchDiv">
										<img
											src={`${swatch.data.product?.featuredImage.url}&width=200`}
											alt="swatch"
											class="swatchImage"
										/>
									</div>
									<div class="swatchHeadingDiv">
										<h2 class="swatchHeading">{swatch.data.product?.title}</h2>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
			{#if sizes.length > 0}
				<p>Selected Size: <span class="selectedSize">{selectedSize ? selectedSize : ''}</span></p>
				<div class="variant">
					{#each sizes as size}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div on:click={handleSizeClick(size)}>
							<p
								class={`${selectedSize == size.val ? 'selectedVariant' : 'size'} ${size.isAvailable ? '' : 'unavailable'}`}
							>
								{size.val}
							</p>
						</div>
					{/each}
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="mobileSelectBtn mb"
					on:click={() => {
						const btnGroup = document.querySelector('.btnGroupToggle');
						btnGroup.style.display = isOpen ? 'none' : 'block';
						isOpen = !isOpen;
						const arrow = document.querySelector('.arrow');
						arrow.classList.toggle('rotated');
						const mobileSelectBtn = document.querySelector('.mobileSelectBtn');
						mobileSelectBtn.classList.toggle('mb');
					}}
				>
					<span class="mobileSelectBtnLeft"
						>Size <span class="selectedSize">{selectedSize ? `: ${selectedSize}` : ''}</span></span
					>
					<span class="mobileSelectBtnRight">
						<img src="/downArrow.png" alt="open" class="arrow" />
					</span>
				</div>
				<div class="btnGroupToggle">
					{#each sizes as size}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class={`sizeVariantDiv ${size.isAvailable ? '' : 'unavailableMobile'}`}
							on:click={handleSizeClickMobile(size)}
						>
							<div class="sizeLabel">
								<p>{size.val}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if available}
				<button
					class="addToCart"
					disabled={!available}
					on:click={() => {
						AddToCart();
					}}
					aria-label="Add To Cart">Add to Cart</button
				>
			{/if}
			{#if !available}
				<button class="notAvailable" disabled aria-label="Not Available">Select Size</button>
			{/if}
			<div class="productTabs">
				<div class="tab">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class={`tabLinks ${activeTab == 'description' ? 'activeTab' : ''}`}
						on:click={() => setActiveTab('description')}
					>
						Description
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class={`tabLinks ${activeTab == 'dimensions' ? 'activeTab' : ''}`}
						on:click={() => setActiveTab('dimensions')}
					>
						Dimensions
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class={`tabLinks ${activeTab == 'whyWeLoveIt' ? 'activeTab' : ''}`}
						on:click={() => setActiveTab('whyWeLoveIt')}
					>
						Why We Love It
					</div>
				</div>
				<div class="tabsInnerBody">
					<div
						class={`tabContent ${activeTab == 'description' ? 'showContent' : ''}`}
						id="description"
					>
						<ul>
							<li>Where the animals are always friendly</li>
							<li>The best of both worlds</li>
							<li>Adorable and fun</li>
							<li>Non-woven paper</li>
						</ul>
					</div>
					<div
						class={`tabContent ${activeTab == 'dimensions' ? 'showContent' : ''}`}
						id="dimensions"
					>
						<ul>
							<li>27' L x 27' W</li>
						</ul>
					</div>
					<div
						class={`tabContent ${activeTab == 'whyWeLoveIt' ? 'showContent' : ''}`}
						id="whyWeLoveIt"
					>
						<ul>
							<li>
								The Antelope’s Forest print was thoughtfully designed by our team as a reminder to
								take a few minutes every day for joy and laughter. The playful nature of the
								Blackbuck, or Indian antelope, and its sociable friend, the zebra, encourage us to
								leave all stress behind and connect with this imaginary forest land for a moment of
								calm.
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div style="padding-top: 80px;"></div>
{#if collectionProducts?.nodes.length > 0}
	<div class="secDiv">
		<div class="sliderDiv">
			<div>
				<p class="collectionHeading">Love This Print?</p>
			</div>
			<div>
				<swiper-container init="false" class="collectionSlider">
					{#each collectionProducts.nodes as product}
						<swiper-slide>
							<a
								class="slide"
								href={`/products/${product.handle}`}
								on:click={(event) => {
									if (
										event.target.closest('.quickShopBtn') ||
										event.target.closest('.quickShopBtnMobile')
									) {
										event.preventDefault();
									}
								}}
								data-sveltekit-reload
							>
								<div class="slideImageDiv">
									<img
										src={`${product.featuredImage.url}&width=600`}
										alt="Product"
										class="slideImage"
									/>
									<button
										class="quickShopBtn"
										on:click={() => {
											isQuickShopClosed.set(false);
											quickShopProduct = product;
										}}
										aria-label="Quick Shop"
									>
										QUICK SHOP
									</button>
									<button
										class="quickShopBtnMobile"
										on:click={() => {
											isQuickShopClosed.set(false);
											quickShopProduct = product;
										}}
										aria-label="Quick Shop"
									>
										<svg
											id="Layer_2"
											data-name="Layer 2"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 53.41 55.72"
										>
											<defs>
												<style>
													.qshbtn {
														fill: none;
														stroke: #000;
														stroke-miterlimit: 10;
														stroke-width: 2.5px;
													}
												</style>
											</defs>
											<g id="Layer_1-2" data-name="Layer 1">
												<g>
													<path
														class="qshbtn"
														d="M14.33,20.24v-11.61c0-1.6.59-3.14,1.68-4.3,1.49-1.59,3.65-3.05,6.51-3.08,2.26-.02,4.94.21,7.54,3.23.97,1.12,1.49,2.59,1.49,4.09v11.67"
													></path>
													<g>
														<path
															class="qshbtn"
															d="M28.55,40.93c.68-5.04,4.65-9.18,9.67-10.03,1.55-.26,3.06-.23,4.47.06-.14-4.14-.21-6.69-.41-9.1-.56-7.06-8-7.32-8-7.32H10.76c-7.69-.17-7.95,7.39-7.95,7.39,0,0-1.27,16.24-1.55,24.71.13,4.89,3.86,6.78,6.02,7.47.79.25,1.61.36,2.44.36,4.53,0,24.36-.03,30.59-.03.64.08-1.73-.02-1.22-.06-6.5-.66-11.45-6.59-10.53-13.45Z"
														></path>
														<path
															class="qshbtn"
															d="M39.08,54.37c.4.04.81.06,1.22.06,6.55,0,11.86-5.31,11.86-11.86,0-5.73-4.06-10.51-9.46-11.62"
														></path>
													</g>
													<g>
														<line class="qshbtn" x1="40.5" y1="36.47" x2="40.5" y2="48.52"></line>
														<line class="qshbtn" x1="46.52" y1="42.5" x2="34.47" y2="42.5"></line>
													</g>
												</g>
											</g>
										</svg>
									</button>
								</div>
								<p class="collectionProductTitle">{product.title}</p>
								<p class="collectionProductPrice">
									${product.priceRange.maxVariantPrice.amount}
								</p>
							</a>
						</swiper-slide>
					{/each}
				</swiper-container>
				{#if !isQuickShopClosedVal}
					<QuickShop product={quickShopProduct} />
				{/if}
			</div>
		</div>
	</div>
{/if}
<div
	id="stamped-main-widget"
	data-product-id={yotpoId}
	data-name={product.title}
	data-url="/products/{product.handle}"
	data-image-url={product.featuredImage.url}
	data-description={product.description}
></div>

<style>
	.container {
		margin: 0 auto;
		max-width: 1440px;
	}
	.main {
		display: flex;
		justify-content: space-evenly;
		width: 100%;
	}
	.addToCart {
		cursor: pointer;
		border: none;
		background: #245490;
		color: white;
		width: 100%;
		padding: 10px;
		font-size: large;
		border: 1px solid #245490;
	}
	.addToCart:hover {
		background-color: transparent;
		color: #245490;
	}
	.notAvailable {
		border: none;
		background: #7d7d7c;
		color: white;
		width: 100%;
		padding: 10px;
		font-size: large;
	}
	.data {
		width: 40%;
		padding: 10px;
	}
	.titleAndPrice {
		display: flex;
		flex-direction: column;
		gap: 20px;
		border-bottom: 1px solid #43434352;
		margin-bottom: 20px;
	}
	.title {
		margin: 0;
	}
	.price {
		font-size: 17px;
		font-weight: 500;
		color: black;
		margin: 0;
		line-height: 25px;
		margin-bottom: 10px;
	}
	.variant {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.variant div {
		cursor: pointer;
	}
	.mobileSelectBtn {
		display: none;
	}

	.mb {
		margin-bottom: 10px;
	}

	.mobileSelectBtnLeft {
		width: 50%;
		font-size: 14px;
		color: #212529;
	}

	.mobileSelectBtnRight {
		width: 50%;
		text-align: right;
	}
	.btnGroupToggle {
		display: none;
		max-height: 196px;
		margin-bottom: 10px;
		width: 100%;
	}
	.sizeVariantDiv {
		font-size: 14px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		padding: 0;
		height: 49px;
		max-width: 100%;
		position: relative;
		border-bottom: 1px solid white;
	}
	.sizeVariantDiv .sizeLabel {
		cursor: pointer;
		background: #f8f5f0;
		border: 1px solid rgba(55, 55, 53, 0.2);
		border-top: 0px;
		box-shadow: none;
		outline: 0;
		font-size: 14px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		padding: 0 0 0 15px;
		height: 49px;
		line-height: 1rem;
		text-align: center;
		border-radius: 0;
	}
	.selectedSize {
		text-transform: uppercase;
	}
	.sizeLabel p {
		text-transform: uppercase;
	}
	.arrow {
		transition: transform 0.5s ease;
	}
	.rotated {
		transform: rotate(180deg);
	}

	.productTabs {
		margin-top: 20px;
	}

	.tab {
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #dcdcdc;
		align-items: center;
	}
	.tabLinks {
		font-size: 15px;
		line-height: 22.5px;
		color: #000;
		cursor: pointer;
		transition: 0.3s;
		opacity: 0.3;
	}
	.activeTab {
		opacity: 1;
		border-bottom: 1px solid #245490;
	}
	.tabsInnerBody {
		padding-top: 15px;
	}
	.tabContent {
		display: none;
	}
	.tabContent.showContent {
		display: block;
		transition: 0.3s;
	}
	.productTabs .tabContent ul {
		padding-left: 22px;
	}
	.productTabs .tabContent ul li {
		font-size: 15px;
		color: #000;
		line-height: 22.5px;
		margin-bottom: 2px;
	}
	.productTabs .tabContent ul li::marker {
		color: #245490;
		font-size: 18px;
	}

	.selectedVariant {
		background-color: #f9f5ef;
		display: flex;
		width: 85px;
		font-size: 16px;
		justify-content: center;
		padding: 10px;
		border: 2px solid pink;
		text-transform: uppercase;
	}
	.unavailable {
		opacity: 0.7;
		cursor: not-allowed;
		position: relative;
	}

	.unavailable::before {
		content: '';
		position: absolute;
		top: 50%;
		left: -4%;
		width: 110%;
		height: 1px;
		background-color: red;
		transform: rotate(-25deg);
		transform-origin: center;
	}
	.unavailableMobile {
		opacity: 0.4;
		cursor: not-allowed;
		position: relative;
	}
	.size {
		background-color: #fff5f5;
		display: flex;
		width: 85px;
		text-transform: uppercase;
		justify-content: center;
		padding: 10px;
		border: 2px solid transparent;
	}
	.bold {
		font-weight: bold;
	}
	.mediaImages {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 10%;
	}
	.mediaImage {
		aspect-ratio: 4 / 5;
		object-fit: cover;
		cursor: pointer;
		max-width: 80px;
		max-height: 100px;
	}
	.mainImageDiv {
		width: 87%;
		margin-left: 10px;
	}
	.mainImage {
		aspect-ratio: 3 / 4;
		object-fit: cover;
		width: 100%;
	}
	.selected {
		opacity: 1;
	}
	.notSelected {
		opacity: 0.3;
	}
	.mobileImages {
		display: none;
		overflow: hidden;
	}
	.mobileImage {
		max-width: 100%;
		object-fit: contain;
		aspect-ratio: 11 / 10;
	}

	.swatches {
		display: flex;
		width: 100%;
		gap: 10px;
		flex-wrap: wrap;
	}
	.swatch {
		border-radius: 50%;
		object-fit: cover;
	}
	.borderPink {
		border: 2px solid #ed9298;
		padding: 1px;
	}
	.swatchModal {
		display: none;
		position: absolute;
		bottom: 35px;
		z-index: 1;
		width: 130px;
		height: 130px;
	}
	.swatchDiv {
		position: relative;
	}
	.swatchDiv:hover .swatchModal {
		display: block;
	}
	.swatchImage {
		width: 130px;
		height: 90px;
		object-fit: cover;
		vertical-align: middle;
		border-style: none;
	}
	.swatchHeadingDiv {
		background-color: #f9f5ef;
	}
	.swatchHeading {
		color: #373735;
		font-size: 11px;
		line-height: 13px;
		text-align: center;
		padding: 4px;
		margin: 0;
		font-weight: 500;
	}
	.images {
		display: flex;
		width: 60%;
	}
	.color {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}
	.colorText {
		color: #000;
		cursor: pointer;
		font-size: 17px;
		transition: 0.4s;
		line-height: 25.5px;
		margin: 0;
		font-weight: 500;
	}
	.transform {
		text-transform: capitalize;
		cursor: pointer;
		font-size: 17px;
		line-height: 25.5px;
		margin: 0;
		color: #434343;
	}
	.secDiv {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #fff5f5;
		margin-bottom: 20px;
	}
	.sliderDiv {
		padding: 26px 76px;
	}
	.collectionHeading {
		font-size: 35px;
		color: #6a6c77;
		padding: 0 0 20px;
		margin: 0;
	}
	.slide {
		display: flex;
		width: 100%;
		flex-direction: column;
		text-decoration: none;
		color: black;
	}
	.slideImage {
		aspect-ratio: 4 /5;
		object-fit: cover;
		width: 100%;
	}
	.collectionProductTitle {
		width: 100%;
		font-size: 12px;
		margin-top: 8px;
		margin-bottom: 4.5px;
	}
	.collectionProductPrice {
		font-size: 12px;
		margin: 0;
	}
	.slide:hover .quickShopBtn {
		bottom: 0px;
		opacity: 1;
		cursor: pointer;
	}
	.quickShopBtn {
		font-family: Poppins;
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		border: none;
		height: 40px;
		background-color: #f9f5ef;
		padding: 0;
		opacity: 0;
		transition: bottom 0.5s linear;
		text-transform: uppercase;
		font-size: 16px;
	}
	.quickShopBtnMobile {
		cursor: pointer;
		display: none;
		position: absolute;
		bottom: 6px;
		right: 3px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		padding: 6px;
		background-color: #f9f5ef;
	}
	.quickShopBtnMobile svg {
		padding-left: 2px;
		width: 24px;
		height: 24px;
	}
	.slideImageDiv {
		position: relative;
	}
	.yotpoReviews {
		margin-top: 20px;
		margin-bottom: 20px;
	}
	swiper-container::part(button-prev) {
		color: black;
		width: 25px;
		height: 25px;
		display: block;
		/* left: var(--swiper-navigation-sides-offset, -70px); */
		/* z-index: 999; */
	}
	swiper-container::part(button-next) {
		color: black;
		width: 25px;
		height: 25px;
		display: block;
		/* right: var(--swiper-navigation-sides-offset, -70px); */
		/* z-index: 999; */
	}
	swiper-container::part(bullet-active) {
		background: #245490 !important;
		width: 33px !important;
		height: 6px !important;
		margin: 0 8px !important;
		border-radius: 10px !important;
	}
	swiper-container::part(bullet) {
		background: white !important;
	}

	@media screen and (max-width: 1024px) {
		.mediaImage {
			max-width: 68px;
			max-height: 80px;
		}
		.mainImageDiv {
			width: 85%;
		}
		.mediaImages {
			width: 11%;
		}
	}
	@media screen and (max-width: 768px) {
		.main {
			flex-direction: column;
		}
		.data {
			width: 100%;
			padding: 20px;
		}
		.images {
			width: 100%;
			justify-content: space-around;
			padding: 0 15px;
		}
		.titleAndPrice {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.variant {
			display: none;
		}
		.mobileSelectBtn {
			display: block;
			margin-right: 0;
			margin-left: 0;
			padding: 12.5px 15px;
			display: flex;
			background: #f3ebe0;
			align-items: center;
		}
		.quickShopBtn {
			display: none;
		}
		.quickShopBtnMobile {
			display: block;
		}
	}
	@media screen and (max-width: 650px) {
		.images {
			display: none;
		}
		.mobileImages {
			display: flex;
		}
		.productGallerySlider::part(button-prev) {
			height: 30px;
			width: 30px;
		}
		.productGallerySlider::part(button-next) {
			height: 30px;
			width: 30px;
		}
		.mediaImages {
			width: 100%;
			flex-direction: row;
			overflow-x: scroll;
		}
		.variant {
			flex-wrap: wrap;
		}
		.mainImageDiv {
			width: 100%;
			margin-left: 0;
		}
		.data {
			width: 100%;
			max-width: 100%;
		}
	}
	@media screen and (max-width: 480px) {
		.collectionHeading {
			font-size: 30px;
		}
	}
	@media screen and (max-width: 380px) {
		.collectionHeading {
			font-size: 25px;
		}
	}
</style>
