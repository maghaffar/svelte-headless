<script>
	import { isQuickShopClosed } from '../stores/quickShop';
	import { isCartUpdated } from '../stores/cart';
	import { register } from 'swiper/element/bundle';
	import { onMount } from 'svelte';
	// register Swiper custom elements
	register();
	export let product;
	let selectedSize;
	let available = false;
	let merchandiseId;
	let showMobileSizes = false;
	let isArrowRotated = false;

	const productImages = [...product.media.nodes.map((media) => media.previewImage.url)];
	let availableVariants = product.variants.nodes.map((variant) => {
		available = false;
		let vari = {
			Size: null,
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

	let sizes = [];
	const variants = product.variants.nodes;
	let size = [];
	for (let i = 0; i < variants.length; i++) {
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

	let selectedColor = null;
	product?.variants.nodes[0]?.selectedOptions.forEach((option) => {
		if (option.name == 'Color') {
			selectedColor = option.value;
		}
	});

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

	function handleMobileSizeClick(size) {
		if (size.isAvailable) {
			selectedSize = size.val;
			handleAvailablity();
			showSizes();
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
		const added = await res.json();
		isQuickShopClosed.set(true);
		if (added == true) {
			isCartUpdated.set(true);
		}
	}

	function showSizes() {
		showMobileSizes = !showMobileSizes;
		isArrowRotated = !isArrowRotated;
	}
	onMount(() => {
		// swiper element
		const swiperEl = document.querySelector('.productSlider');

		const swiperParams = {
			slidesPerView: 1,
			navigation: true,
			loop: true
		};

		if (swiperEl) {
			Object.assign(swiperEl, swiperParams);
			swiperEl.initialize();
		}
	});
</script>

<div class="quickShopModal">
	<div class="quickShopContent">
		<button
			class="closeModal"
			on:click={() => {
				isQuickShopClosed.set(true);
			}}
			aria-label="Close"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="20"
				height="20"
				viewBox="0 0 24 24"
			>
				<path
					d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"
					fill="black"
					stroke="black"
					stroke-width="2"
				></path>
			</svg></button
		>
		<div class="header">
			<p class="quickShopText">Quick Shop</p>
		</div>
		<div class="quickShopBody">
			<div class="quickShopInner">
				<div class="innerLeft">
					<img
						src={`${product?.featuredImage?.url}&width=350`}
						alt={product?.title}
						class="singleImage"
					/>
					<div class="productImagesSlider">
						<swiper-container init="false" class="productSlider">
							{#each productImages as url}
								<swiper-slide>
									<img src={`${url}&width=350`} alt="Product" />
								</swiper-slide>
							{/each}
						</swiper-container>
					</div>
				</div>
				<div class="innerRight">
					<div class="title">{product?.title}</div>
					<div class="reviews">
						<div>
							<img src="/star.svg" alt="star" />
							<img src="/star.svg" alt="star" />
							<img src="/star.svg" alt="star" />
							<img src="/star.svg" alt="star" />
							<img src="/star.svg" alt="star" />
						</div>
						<p class="totalReviewsText">200 Reviews</p>
					</div>
					<p class="productPrice">${product?.priceRange.maxVariantPrice.amount}</p>
					<div class="productInstallments">
						<span>
							Pay in 4 interest free <br /> installments with
						</span>
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							class="shopPayLogo"
							viewBox="0 0 424 102"
							fill="none"
						>
							<path
								d="M108.665 32.87c-3.402-7.136-9.852-11.746-19.57-11.746a19.48 19.48 0 00-15.303 7.868l-.355.432V1.454a.61.61 0 00-.61-.61h-13.74a.61.61 0 00-.599.61v80.23a.598.598 0 00.598.598h14.717a.61.61 0 00.609-.598V47.475c0-6.648 4.433-11.358 11.525-11.358 7.757 0 9.718 6.383 9.718 12.888v32.679a.598.598 0 00.599.598h14.682a.609.609 0 00.61-.598v-34.63c0-1.185 0-2.349-.155-3.48a30.617 30.617 0 00-2.726-10.704zM35.184 44.76s-7.491-1.76-10.25-2.47c-2.76-.71-7.58-2.217-7.58-5.863 0-3.646 3.89-4.81 7.834-4.81 3.945 0 8.334.954 8.677 5.331a.632.632 0 00.632.576l14.505-.055a.618.618 0 00.587-.414.62.62 0 00.034-.251C48.725 22.797 36.436 17.788 25.1 17.788c-13.442 0-23.271 8.865-23.271 18.64 0 7.136 2.017 13.829 17.874 18.483 2.782.809 6.56 1.862 9.863 2.781 3.967 1.109 6.105 2.782 6.105 5.42 0 3.058-4.432 5.185-8.787 5.185-6.305 0-10.782-2.338-11.148-6.538a.632.632 0 00-.632-.554l-14.472.067a.631.631 0 00-.632.654C.665 75.145 13.431 82.27 25.332 82.27c17.73 0 25.743-9.973 25.743-19.315.022-4.388-.987-14.384-15.891-18.196zm186.611-23.658c-7.369 0-13.542 4.078-17.52 8.998v-8.422a.597.597 0 00-.587-.599h-13.763a.601.601 0 00-.599.599v78.678a.598.598 0 00.599.587h14.727a.587.587 0 00.587-.587V74.492h.222c2.338 3.568 8.732 7.846 17.087 7.846 15.714 0 28.812-13.032 28.812-30.64.011-16.9-13.021-30.596-29.565-30.596zm-1.363 46.242a15.613 15.613 0 1115.226-15.647 15.4 15.4 0 01-4.362 10.987 15.404 15.404 0 01-10.864 4.66zm-74.689-49.7c-13.73 0-20.578 4.666-26.075 8.4l-.166.11a1.364 1.364 0 00-.41 1.807l5.43 9.353a1.373 1.373 0 00.964.665 1.342 1.342 0 001.108-.3l.433-.354c2.825-2.372 7.358-5.54 18.328-6.405 6.106-.488 11.381 1.108 15.27 4.743 4.278 3.945 6.838 10.316 6.838 17.043 0 12.378-7.292 20.157-19.005 20.312-9.652-.055-16.135-5.086-16.135-12.522 0-3.945 1.785-6.516 5.264-9.087a1.349 1.349 0 00.41-1.728l-4.876-9.22a1.42 1.42 0 00-.853-.687 1.371 1.371 0 00-1.108.144c-5.474 3.247-12.19 9.186-11.824 20.6.443 14.528 12.522 25.62 28.224 26.075h1.862c18.661-.61 32.136-14.462 32.136-33.245 0-17.242-12.566-35.704-35.815-35.704z"
								fill="rgb(90, 49, 244)"
							></path>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M281.734 1.044h125.652c8.672 0 15.703 7.03 15.703 15.703V85.54c0 8.672-7.031 15.702-15.703 15.702H281.734c-8.672 0-15.702-7.03-15.702-15.702V16.747c0-8.673 7.03-15.703 15.702-15.703zm28.191 54.488c10.483 0 17.985-7.647 17.985-18.362 0-10.66-7.502-18.351-17.985-18.351h-18.506a.829.829 0 00-.831.83v50.787a.84.84 0 00.831.831h6.959a.831.831 0 00.831-.83V56.362a.83.83 0 01.832-.831h9.884zm-.532-29c5.696 0 9.896 4.498 9.896 10.638 0 6.15-4.2 10.638-9.896 10.638h-9.352a.83.83 0 01-.832-.82V27.363a.844.844 0 01.832-.831h9.352zm20.567 34.995a9.875 9.875 0 014.123-8.467c2.704-2.028 6.892-3.08 13.109-3.324l6.593-.222v-1.95c0-3.89-2.615-5.54-6.815-5.54s-6.848 1.484-7.469 3.911a.793.793 0 01-.797.576h-6.505a.816.816 0 01-.807-.588.815.815 0 01-.024-.354c.975-5.762 5.74-10.14 15.902-10.14 10.793 0 14.682 5.02 14.682 14.606v20.368a.823.823 0 01-.239.595.835.835 0 01-.592.247h-6.571a.836.836 0 01-.592-.247.833.833 0 01-.239-.595v-1.518a.619.619 0 00-.783-.65.62.62 0 00-.325.218c-1.962 2.138-5.153 3.69-10.239 3.69-7.458.022-12.412-3.879-12.412-10.616zm23.825-4.433V55.52l-8.532.444c-4.499.232-7.126 2.105-7.126 5.252 0 2.848 2.405 4.433 6.594 4.433 5.696 0 9.064-3.08 9.064-8.544v-.011zm14.772 23.626v5.928a.854.854 0 00.609.864c1.159.316 2.357.462 3.558.433 6.371 0 12.189-2.327 15.514-11.392l14.627-39.018a.847.847 0 00-.112-.753.848.848 0 00-.675-.355h-6.815a.829.829 0 00-.798.576l-8.056 24.712a.854.854 0 01-1.596 0l-9.286-24.778a.855.855 0 00-.787-.543h-6.649a.841.841 0 00-.786 1.108l13.674 35.128a.82.82 0 010 .565l-.432 1.363a7.877 7.877 0 01-7.945 5.618 16.45 16.45 0 01-3.048-.288.839.839 0 00-.918.472.826.826 0 00-.079.36z"
								fill="rgb(90, 49, 244)"
							></path>
						</svg>
					</div>
					<p class="selectedColor">Selected Color</p>
					<div class="modalProductSwatch">
						<img src={`${product?.featuredImage?.url}&width=30`} alt={product?.title} />
						<span class="color">{selectedColor}</span>
					</div>
					<div class="productVariants">
						<div class="variantOptions">
							<p class="variantTitle">
								Select Size: <span>{selectedSize ? selectedSize : ''}</span>
							</p>
							<div class="sizes">
								{#each sizes as size, i}
									<button
										class={`${size.isAvailable ? 'available' : 'notAvailable'} ${selectedSize == size.val ? 'selected' : ''}`}
										disabled={!size.isAvailable}
										on:click={() => handleSizeClick(size)}
										aria-label="Size">{size.val}</button
									>
								{/each}
							</div>
						</div>
						<div class="modalFooter">
							<button
								class={`${available ? 'addToCart' : 'addToCartDisabled'}`}
								disabled={!available}
								on:click={() => {
									AddToCart();
								}}>Add To Cart</button
							>
							<a
								class="seeFullDetails"
								href="/products/{product?.handle}"
								on:click={() => {
									isQuickShopClosed.set(true);
								}}>See Full Details</a
							>
						</div>
					</div>
				</div>
			</div>
			<div class="productVariantsForMobile">
				<div class="variantOptions">
					<p class="variantTitle">
						Size: <span>{selectedSize ? selectedSize : ''}</span>
					</p>
					<div class="variantsMobile">
						<div class="selectWraper">
							<div class="select">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div class="selectTrigger" on:click={showSizes}>
									<span style={`text-transform: ${selectedSize ? 'uppercase' : 'capitalize'}`}
										>{selectedSize ? selectedSize : 'Select Size'}</span
									>
									<div class="arrowContainer">
										<img
											src="/downArrow.png"
											alt="arrow"
											class="arrow {isArrowRotated ? 'rotated' : ''}"
										/>
									</div>
								</div>
								<div class="mobileSizes {showMobileSizes ? 'active' : ''}">
									{#each sizes as size, i}
										<button
											class={`${size.isAvailable ? 'availableSize' : 'availableSize disabled'} ${selectedSize == size.val ? 'selectedSize' : ''}`}
											disabled={!size.isAvailable}
											on:click={() => handleMobileSizeClick(size)}
											aria-label="Select Size">{size.val}</button
										>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modalFooter">
					<button
						class={`${available ? 'addToCart' : 'addToCartDisabled'}`}
						disabled={!available}
						on:click={() => {
							AddToCart();
						}}
						aria-label="Add To Cart">Add To Cart</button
					>
					<a
						class="seeFullDetails"
						href="/products/{product?.handle}"
						on:click={() => {
							isQuickShopClosed.set(true);
						}}>See Full Details</a
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.quickShopModal {
		display: block;
		opacity: 1;
		z-index: 9999;
		padding: 20px;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.1);
		transition: opacity 0.5s ease-in-out;
	}
	.quickShopContent {
		background-color: white;
		margin: 0 auto;
		border: 1px solid #888;
		width: 100%;
		max-width: 845px;
		position: relative;
		padding-bottom: 45px;
	}
	.closeModal {
		position: absolute;
		right: 20px;
		top: 20px;
		background-color: transparent;
		z-index: 9;
		width: 25px;
		height: 25px;
		border: none;
		cursor: pointer;
	}
	.header {
		display: flex;
		justify-content: center;
	}
	.quickShopText {
		color: #373735;
		font-size: 30px;
		font-weight: 700;
		line-height: 22px;
		margin-top: 30px;
		margin-bottom: 13px;
		text-transform: uppercase;
	}
	.quickShopBody {
		padding: 22px 48px 0 46px;
	}
	.quickShopInner {
		display: flex;
	}
	.innerLeft {
		display: unset;
		position: relative;
		width: 50%;
	}
	.innerLeft img {
		max-width: 100%;
		max-height: 100%;
		object-fit: cover;
	}
	.innerRight {
		padding-left: 20px;
		width: 50%;
	}
	.title {
		font-family: Poppins;
		font-size: 24px;
		line-height: 24px;
		color: #373735;
		font-weight: 400;
		margin-bottom: 12px;
	}
	.reviews {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.totalReviewsText {
		font-family: Poppins;
		font-size: 12px;
		line-height: 17px;
	}
	.productPrice {
		font-weight: 400;
		font-size: 24px;
		line-height: 24px;
		color: #373735;
		margin-bottom: 6px;
		margin-top: 0;
	}
	.productInstallments {
		margin-bottom: 15px;
		font-family: Poppins;
		border-bottom: 1px dashed;
	}
	.productInstallments span {
		opacity: 0.8;
	}
	.selectedColor {
		font-weight: 500;
		font-size: 18px;
		line-height: 12px;
		margin-bottom: 18px;
		margin-top: 20px;
		color: #373735;
		font-family: Poppins;
		text-transform: uppercase;
	}
	.modalProductSwatch {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.modalProductSwatch img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		object-fit: cover;
	}
	.color {
		color: #373735;
		font-size: 16px;
		height: 12px;
		font-style: italic;
		font-family: Poppins;
		text-transform: capitalize;
		margin-bottom: 15px;
	}
	.productVariants {
		display: block;
		padding-top: 22px;
	}
	.variantTitle {
		display: flex;
		align-items: center;
		color: #373735;
		font-size: 16px;
		font-family: Poppins;
		margin-top: 8px;
		margin-bottom: 8px;
		text-transform: uppercase;
	}
	.variantTitle span {
		margin-left: 5px;
	}
	.sizes {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		font-family: Poppins;
		margin-bottom: 10px;
	}
	.available {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		border: 1px solid #37373599;
		font-weight: 400;
		line-height: 17px;
		text-align: center;
		color: #373735;
		min-width: 35px;
		height: 31px;
		padding: 0 4px;
		text-transform: uppercase;
		background-color: #f9f5ef;
		cursor: pointer;
	}
	.selected {
		background-color: #f0e6da;
	}
	.notAvailable {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.modalFooter {
		padding-top: 8px;
		margin-top: 22px;
		font-family: Poppins;
	}
	.addToCart {
		display: flex;
		width: 100%;
		height: 45px;
		justify-content: center;
		align-items: center;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 16px;
		text-align: center;
		border: 0;
		outline: 0;
		color: #fff;
		text-transform: uppercase;
		background: rgb(36, 84, 144);
		cursor: pointer;
	}
	.addToCartDisabled {
		display: flex;
		width: 100%;
		height: 45px;
		justify-content: center;
		align-items: center;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 16px;
		text-align: center;
		border: 0;
		outline: 0;
		text-transform: uppercase;
		cursor: not-allowed;
	}
	.seeFullDetails {
		font-weight: 400;
		font-size: 14px;
		line-height: 17px;
		color: #373735;
		text-decoration: underline;
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: center;
		padding-top: 16px;
		text-transform: uppercase;
	}
	.productVariantsForMobile {
		display: none;
		padding-top: 22px;
		width: 100%;
	}
	.variantsMobile {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		font-family: Poppins;
	}
	.selectWraper {
		position: relative;
		width: 100%;
	}
	.select {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.selectTrigger {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 8px;
		font-size: 12px;
		font-weight: 300;
		color: rgb(204, 204, 204);
		height: 35px;
		line-height: 22px;
		cursor: pointer;
		background-color: #fff;
		border: 1px solid #245490;
	}
	.arrowContainer {
		display: flex;
	}
	.arrow {
		transition: transform 0.5s ease;
		width: 30px;
		height: 30px;
	}
	.rotated {
		transform: rotate(180deg);
	}
	.mobileSizes {
		position: absolute;
		display: block;
		top: 100%;
		left: 0;
		right: 0;
		border-top: 0;
		background-color: #fff;
		transition: all 0.5s;
		z-index: -1;
		opacity: 0;
		visibility: hidden;
		border: 1px solid #245490;
		pointer-events: none;
	}
	.active {
		opacity: 1;
		visibility: visible;
		pointer-events: all;
		z-index: 2;
	}
	.availableSize {
		position: relative;
		display: block;
		padding: 0 22px;
		font-size: 16px;
		font-weight: 300;
		line-height: 32px;
		color: #3b3b3b;
		cursor: pointer;
		transition: all 0.5s;
		visibility: visible;
		pointer-events: all;
		width: 100%;
		background-color: #fff;
		text-align: left;
		border: none;
		text-transform: uppercase;
	}
	.disabled {
		color: #cccccc;
		text-decoration: line-through;
		pointer-events: none;
	}
	.selectedSize {
		color: #fff;
		background-color: #305c91;
	}
	.shopPayLogo {
		height: 14px;
		width: 59px;
	}
	.productImagesSlider {
		display: none;
	}
	swiper-container::part(button-prev) {
		color: black;
		width: 18px;
		height: 18px;
		display: block;
		left: var(--swiper-navigation-sides-offset, -4px);
		top: var(--swiper-navigation-top-offset, 55%);
	}
	swiper-container::part(button-next) {
		color: black;
		width: 18px;
		height: 18px;
		display: block;
		right: var(--swiper-navigation-sides-offset, -4px);
		top: var(--swiper-navigation-top-offset, 55%);
	}

	@media only screen and (max-width: 768px) {
		.productVariants {
			display: none;
		}
		.productVariantsForMobile {
			display: block;
		}
		.innerRight {
			width: 58%;
		}
		.innerLeft {
			width: 42%;
		}
	}
	@media only screen and (max-width: 480px) {
		.title {
			font-size: 16px;
		}
		.reviews {
			display: none;
		}
		.productPrice {
			font-size: 16px;
		}
		.selectedColor {
			font-size: 15px;
		}
		.productInstallments {
			font-size: 10px;
		}
		.singleImage {
			display: none;
		}
		.productImagesSlider {
			display: block;
		}
	}
	@media screen and (max-width: 390px) {
		.selectedColor {
			font-size: 13px;
		}
	}
</style>
