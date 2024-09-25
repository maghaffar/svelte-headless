<script>
	import Filter from '../../../components/Filter.svelte';
	import QuickShop from '../../../components/QuickShop.svelte';
	import { isQuickShopClosed } from '../../../stores/quickShop';
	import { selectedSize, sortKey } from '../../../stores/filter';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	export let data;
	$: isQuickShopClosedVal = true;
	isQuickShopClosed.subscribe((value) => {
		isQuickShopClosedVal = value;
	});
	$: quickShopProduct = null;
	$: selectedSizeVal = null;
	selectedSize.subscribe((value) => {
		selectedSizeVal = value;
	});
	$: collectionHandle = data.collectionHandle;
	$: filteredCollectionProducts = [];

	async function getFilteredProducts() {
		const res = await fetch('/api/filterCollectionProductsBySize', {
			method: 'POST',
			body: JSON.stringify({
				collectionHandle,
				size: selectedSizeVal
			})
		});
		const data = await res.json();
		const {
			collection: { products }
		} = data;
		filteredCollectionProducts = products.nodes.length > 0 ? products.nodes : [];
		if (filteredCollectionProducts.length === 0) {
			selectedSize.set('');
		}
	}
	$: if (selectedSizeVal != null) {
		getFilteredProducts();
	} else {
		filteredCollectionProducts = [];
	}

	$: sortKeyVal = 'default';
	$: sortedProducts = [];
	sortKey.subscribe((value) => {
		sortKeyVal = value;
	});
	async function getSortedProducts(sortKey, reverse) {
		const res = await fetch('/api/sortCollectionProducts', {
			method: 'POST',
			body: JSON.stringify({
				collectionHandle,
				sortKey,
				reverse,
				selectedSizeVal
			})
		});
		const data = await res.json();
		sortedProducts = data.products ? data.products.nodes : [];
	}
	$: if (sortKeyVal == 'highToLow') {
		getSortedProducts('PRICE', true);
	} else if (sortKeyVal == 'lowToHigh') {
		getSortedProducts('PRICE', false);
	} else if (sortKeyVal == 'aToZ') {
		getSortedProducts('TITLE', false);
	} else if (sortKeyVal == 'zToA') {
		getSortedProducts('TITLE', true);
	} else {
		sortedProducts = [];
	}

	function show4Images() {
		if (browser && window.innerWidth > 768) {
			const images = document.getElementsByClassName('collectionImage');
			const cards = document.getElementsByClassName('productCard');
			const cardsArray = Array.from(cards);
			cardsArray.forEach((card) => {
				card.style.width = '20%';
			});
			const imagesArray = Array.from(images);
			imagesArray.forEach((image) => {
				image.style.maxWidth = '300px';
				image.style.maxHeight = '370px';
				image.style.minWidth = '300px';
				image.style.minHeight = '370px';
			});
			const price = document.getElementsByClassName('price');
			const priceArray = Array.from(price);
			priceArray.forEach((div) => {
				div.style.fontSize = '12px';
			});

			const title = document.getElementsByClassName('title');
			const titleArray = Array.from(title);
			titleArray.forEach((div) => {
				div.style.fontSize = '12px';
			});
		}
	}

	$: collection = data.collection;
	$: products =
		filteredCollectionProducts.length > 0
			? filteredCollectionProducts
			: sortedProducts.length > 0
				? sortedProducts
				: collection.products.nodes;

	$: if (products) {
		show4Images();
	}
</script>

<svelte:head>
	<title>{collection.title}</title>
</svelte:head>

<div class="container">
	<h1 class="collectionTitle">{collection.title}</h1>
	<Filter />
	<div class="productsMain">
		<div class="products">
			{#each products as product}
				<a
					href={`/products/${product.handle}`}
					class="productCard"
					data-sveltekit-reload
					on:click={(event) => {
						if (
							event.target.closest('.quickShopBtnDesktop') ||
							event.target.closest('.quickShopBtnMobile')
						) {
							event.preventDefault();
						}
					}}
				>
					<div class="imageContainer">
						<img
							data-sveltekit-preload-data="hover"
							src={`${product.featuredImage?.url}&width=800`}
							alt="Product"
							class="collectionImage primary"
						/>
						{#if product.media?.nodes?.length >= 2}
							<img
								src={`${product.media.nodes[1]?.previewImage.url}&width=800`}
								alt="Product"
								class="collectionImage secondary"
							/>
						{/if}
						<button
							class="quickShopBtnDesktop"
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
					<div class="priceTitle">
						<a href={`/products/${product.handle}`} class="title" data-sveltekit-reload
							>{product.title}</a
						>
						<p class="price">${product.priceRange.maxVariantPrice.amount}</p>
					</div>
				</a>
			{/each}
			{#if !isQuickShopClosedVal}
				<QuickShop product={quickShopProduct} />
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1440px;
		margin: 0 auto;
	}
	.productCard {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* border: 1px solid black; */
		border-radius: 10px;
		width: 20%;
		text-decoration: none;
		color: black;
		padding: 10px;
		overflow: hidden;
	}
	.collectionTitle {
		font-size: 42px;
		line-height: 75px;
		color: #000;
		margin: 0;
		padding: 0 0 16px;
		text-align: center;
		font-weight: 400;
	}
	.products {
		display: flex;
		gap: 20px;
		width: 100%;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
	}
	.priceTitle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 300px;
	}
	.title {
		font-size: 12px;
		line-height: 18px;
		font-weight: 400;
		color: black;
		text-decoration: none;
	}
	.title:hover {
		text-decoration: underline;
	}
	.price {
		font-size: 12px;
	}
	.collectionImage {
		max-width: 320px;
		height: 400px;
		object-fit: cover;
	}
	.secondary {
		display: none;
	}
	.productCard:hover .primary {
		display: none;
	}
	.productCard:hover .secondary {
		display: block;
	}
	.imageContainer {
		position: relative;
	}
	.quickShopBtnDesktop {
		font-family: Poppins;
		position: absolute;
		bottom: -2px;
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
		bottom: 3px;
		right: 35px;
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
	@media only screen and (min-width: 768px) {
		.productCard:hover .quickShopBtnDesktop {
			bottom: 0px;
			opacity: 1;
			cursor: pointer;
		}
	}
	@media only screen and (max-width: 768px) {
		.collectionImage {
			max-width: 375px !important;
			max-height: 470px !important;
			min-width: 375px !important;
			min-height: 470px !important;
		}
		.priceTitle {
			flex-direction: column;
			align-items: flex-start;
		}
		.price {
			margin: 0;
		}
		.productCard {
			width: 40% !important;
		}
		.quickShopBtnDesktop {
			display: none;
		}
		.quickShopBtnMobile {
			display: block;
		}
	}
	@media only screen and (max-width: 480px) {
		.collectionImage {
			max-width: 202px !important;
			max-height: 252px !important;
			min-width: 202px !important;
			min-height: 253px !important;
		}
		.title {
			font-size: 10px;
			line-clamp: 4;
			-webkit-line-clamp: 4;
		}
		.productCard {
			width: 30%;
		}
		.quickShopBtnMobile {
			bottom: 2px;
			right: 18px;
		}
	}
	@media (max-width: 400px) {
		.quickShopBtnMobile {
			right: 29px;
			bottom: 7px;
		}
	}
</style>
