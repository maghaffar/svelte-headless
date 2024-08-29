<script>
	import Filter from '../../../components/Filter.svelte';
	export let data;
	const products = data.edges;
</script>

<div class="container">
	<h1 class="collectionTitle">Products</h1>
	<Filter />
	<div class="products">
		{#each products as product}
			<a
				href={`/products/${product.node.handle}`}
				class="productCard"
				data-sveltekit-preload-data="hover"
			>
				<img
					data-sveltekit-preload-data="hover"
					src={`${product.node.featuredImage?.url}&width=800`}
					alt="Product"
					class="collectionImage primary"
				/>
				{#if product.node.media?.nodes?.length >= 2}
					<img
						src={`${product.node.media.nodes[1]?.previewImage.url}&width=800`}
						alt="Product"
						class="collectionImage secondary"
					/>
				{/if}
				<div class="priceTitle">
					<a href={`/products/${product.node.handle}`} class="title">{product.node.title}</a>
					<p class="price">${product.node.priceRange.maxVariantPrice.amount}</p>
				</div>
			</a>
		{/each}
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
		max-width: 300px;
		height: 370px;
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
			-webkit-line-clamp: 4;
		}
		.productCard {
			width: 30%;
		}
	}
</style>
