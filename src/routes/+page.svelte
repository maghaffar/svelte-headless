<script>
	import { onMount } from 'svelte';
	export let data;
	const collections = data.edges;
	const featuredImage = data.featuredImage;
	const imageText = data.imageText;
	const imageDescription = data.imageDescription;
	const products = data.products?.slice(2, 6);
	const articles = data.articles?.length > 4 ? data.articles?.slice(0, 4) : data.articles;

	onMount(() => {
		const flkty = new Flickity('.main-carousel', {
			cellAlign: 'left',
			contain: true,
			pageDots: false
		});

		const arrows = document.getElementsByClassName('flickity-prev-next-button');
		for (let i = 0; i < arrows.length; i++) {
			arrows[i].style.width = '30px';
			arrows[i].style.height = '30px';
		}
	});
</script>

<div class="cover">
	<img src={featuredImage.url} alt="cover" class="coverImage" />
	<div class="coverText">
		<h2 class="imageText">{imageText}</h2>
		<p class="imageDescription">{imageDescription}</p>
		<a href="/collections/all" class="shopBtn" data-sveltekit-preload-data="hover">Shop Now</a>
	</div>
</div>
<div class="featuredCollectionsBackground">
	<div class="featuredCollections">
		<p class="featuredCollectionsTitle">Live On The Bright Side</p>
		<div class="collections">
			{#if collections}
				{#each collections as collection}
					<div class="card">
						<a href={`/collections/${collection.node.handle}`}>
							<img
								class="collectionImage"
								src={`${collection.node.image?.url}&width=350`}
								alt={collection.node.title}
							/>
						</a>
						<div class="collectionTitle">
							<p>{collection.node.title}</p>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
<div class="container">
	<div class="featuredProducts">
		<p class="featuredProductsTitle">Our Favorites</p>
		<div class="products">
			{#if products}
				{#each products as product}
					<a
						data-sveltekit-preload-data="hover"
						href={`/products/${product.node.handle}`}
						class="product"
					>
						<img
							src={`${product.node.featuredImage?.url}&width=400`}
							alt="Product"
							class="productImage primary"
						/>
						{#if product.node.media?.nodes?.length >= 2}
							<img
								src={`${product.node.media.nodes[1]?.previewImage.url}&width=400`}
								alt="Product"
								class="productImage secondary"
							/>
						{/if}
						<p class="productTitle">{product.node.title}</p>
					</a>
				{/each}
			{/if}
		</div>
	</div>
</div>
<div class="bgImagesWithText">
	<div class="firstImage">
		<div class="content">
			<h1 class="contentTitle">Summer Escape</h1>
			<p class="contentText">Get ready for the perfect summer</p>
			<div class="buttonMobile">
				<a href="/collections/all" class="buttonText">Shop Now</a>
			</div>
		</div>
		<div class="button">
			<a href="/collections/all" class="buttonText">Shop Now</a>
		</div>
	</div>
	<div class="secondImage">
		<div class="content">
			<h1 class="contentTitle">Printed Perks</h1>
			<p class="contentText">Get ready for the perfect summer</p>
			<div class="buttonMobile">
				<a href="/collections/all" class="buttonText">Shop Now</a>
			</div>
		</div>
		<div class="button">
			<a href="/collections/all" class="buttonText">Shop Now</a>
		</div>
	</div>
</div>
<div class="articlesBanner">
	<div class="articleContent">
		<div class="upperContent">
			<div>
				<p>PF Mag</p>
				<p>With new articles added weekly, there is always more to discover</p>
			</div>
			<a href="/blogs/all" class="seeMoreButton">Explore</a>
		</div>
		<div class="magArticlesDesktop">
			<div class="lowerContent">
				<div class="leftSide">
					<div class="articleCard">
						<div class="articleText">
							<h3 class="magHeading">{articles[0]?.title}</h3>
							<p class="excerpt">{articles[0]?.excerpt}</p>
							<a href={`/blogs/${articles[0]?.blog.handle}/${articles[0].handle}`} class="link"
								><p>READ</p></a
							>
						</div>
						<div class="articleImage">
							<img
								src={`${articles[0]?.image?.url}&width=600`}
								alt={articles[0]?.title}
								class="articleCardImage"
							/>
						</div>
					</div>
					<div class="articleCard">
						<div class="articleText">
							<h3 class="magHeading">{articles[1]?.title}</h3>
							<p class="excerpt">{articles[1]?.excerpt}</p>
							<a href={`/blogs/${articles[1]?.blog.handle}/${articles[1].handle}`} class="link"
								><p>READ</p></a
							>
						</div>
						<div class="articleImage">
							<img
								src={`${articles[1]?.image?.url}&width=600`}
								alt={articles[1]?.title}
								class="articleCardImage"
							/>
						</div>
					</div>
				</div>
				<div class="rightSide">
					<div class="rightArticle">
						<div class="rightArticleImage">
							<img
								src={`${articles[2]?.image?.url}&width=600`}
								alt={articles[2]?.title}
								class="rightArticleCardImage"
							/>
						</div>
						<div class="rightArticleText">
							<h3 class="magHeading">{articles[2]?.title}</h3>
							<p class="excerpt">{articles[2]?.excerpt}</p>
							<a href={`/blogs/${articles[2]?.blog.handle}/${articles[2].handle}`} class="link"
								>READ</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="magArticlesMobile">
			<div class="main-carousel">
				<div class="mobileArticle">
					<a
						href={`/blogs/${articles[0]?.blog.handle}/${articles[0].handle}`}
						class="mobArticleLink"
					>
						<div class="mobileArticleImage">
							<img
								src={`${articles[0]?.image?.url}&width=600`}
								alt={articles[0]?.title}
								class="img"
							/>
						</div>
						<div class="mobileArticleContent">
							<h2 class="heading">{articles[0]?.title}</h2>
							<div class="articleExcerpt">
								<p>{articles[0]?.excerpt}</p>
							</div>
							<div class="read">READ</div>
						</div>
					</a>
				</div>
				<div class="mobileArticle">
					<a
						href={`/blogs/${articles[1]?.blog.handle}/${articles[1].handle}`}
						class="mobArticleLink"
					>
						<div class="mobileArticleImage">
							<img
								src={`${articles[1]?.image?.url}&width=600`}
								alt={articles[1]?.title}
								class="img"
							/>
						</div>
						<div class="mobileArticleContent">
							<h2 class="heading">{articles[1]?.title}</h2>
							<div class="articleExcerpt">
								<p>{articles[1]?.excerpt}</p>
							</div>
							<div class="read">READ</div>
						</div>
					</a>
				</div>
				<div class="mobileArticle">
					<a
						href={`/blogs/${articles[2]?.blog.handle}/${articles[2].handle}`}
						class="mobArticleLink"
					>
						<div class="mobileArticleImage">
							<img
								src={`${articles[2]?.image?.url}&width=600`}
								alt={articles[2]?.title}
								class="img"
							/>
						</div>
						<div class="mobileArticleContent">
							<h2 class="heading">{articles[2]?.title}</h2>
							<div class="articleExcerpt">
								<p>{articles[2]?.excerpt}</p>
							</div>
							<div class="read">READ</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1440px;
		margin: 0 auto;
	}
	.cover {
		margin: 0 auto;
		width: 100%;
		position: relative;
	}
	.coverImage {
		aspect-ratio: 8 /4;
		object-fit: cover;
		max-height: 650px;
	}
	.coverText {
		position: absolute;
		top: 37%;
		color: white;
		left: 36%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.imageText {
		font-size: 60px;
		margin: 0;
	}
	.imageDescription {
		font-size: 15px;
		margin: 0;
		text-align: center;
	}
	.shopBtn {
		color: #245490;
		background-color: white;
		width: 100%;
		max-width: 150px;
		text-align: center;
		text-decoration: none;
		margin-top: 20px;
		height: 50px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		line-height: 21px;
	}
	.shopBtn:hover {
		background-color: transparent;
		border: 1px solid white;
	}
	img {
		width: 100%;
	}

	.card {
		display: flex;
		width: 20%;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		color: black;
	}
	.collections {
		display: flex;
		width: 100%;
		margin: 0 auto;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;
	}
	.collectionImage {
		aspect-ratio: 3 / 4;
		object-fit: cover;
	}

	.collectionTitle p {
		font-weight: inherit;
		font-size: inherit;
		line-height: inherit;
	}
	.collectionTitle:hover {
		background: #fff5f5;
	}
	.product {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		width: 20%;
		text-decoration: none;
		color: black;
		padding: 10px;
		overflow: hidden;
	}
	.productImage {
		aspect-ratio: 4 / 5;
		object-fit: cover;
	}
	.secondary {
		display: none;
	}
	.product:hover .primary {
		display: none;
	}
	.product:hover .secondary {
		display: block;
	}
	.productTitle {
		font-size: 13px;
		font-weight: 400;
		line-height: 0.8rem;
		color: #373735;
		display: flex;
		justify-content: start;
		width: 100%;
		margin-top: 10px;
		text-decoration: none;
	}
	.productTitle:hover {
		text-decoration: underline;
	}
	.products {
		display: flex;
		gap: 20px;
		width: 100%;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
	.excerpt {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		font-size: 14px;
		line-height: 21px;
		font-style: italic;
	}
	.featuredCollections {
		margin: 0 auto;
		max-width: 1440px;
	}
	.featuredCollectionsTitle {
		text-align: center;
		margin-top: -3px;
		padding-top: 30px;
		color: #373735;
		font-size: 35px;
	}
	.featuredCollectionsBackground {
		width: 100%;
		background-color: #fff5f5;
	}

	.bgImagesWithText {
		display: flex;
		padding: 70px 10px;
		gap: 10px;
		flex-wrap: wrap;
	}
	.firstImage {
		background-image: url('/bg-1.jpg');
		background-size: cover;
		min-height: 650px;
		width: 49.5%;
		background-repeat: no-repeat;
		background-position: center;
		position: relative;
	}
	.secondImage {
		background-image: url('/bg-2.jpg');
		background-size: cover;
		min-height: 650px;
		width: 49.5%;
		background-repeat: no-repeat;
		background-position: center;
		position: relative;
	}

	.content {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%);
		text-align: center;
		width: 100%;
		background-color: #fff;
		padding: 40px 20px;
		max-width: 540px;
		z-index: 1;
		transition: 0.4s linear bottom;
	}

	.contentTitle {
		font-size: 40px;
		line-height: 50px;
	}

	.contentText {
		font-size: 15px;
		line-height: 22px;
		color: #000;
		max-width: 400px;
		margin: 0 auto;
		position: relative;
		background: #fff;
	}

	.button {
		position: absolute;
		left: 50%;
		width: 100%;
		transform: translate(-50%);
		text-align: center;
		max-width: 540px;
		background: #fff;
		bottom: 0;
	}
	.buttonMobile {
		display: none;
	}
	.buttonText {
		display: inline-flex;
		height: 50px;
		width: 100%;
		max-width: 150px;
		justify-content: center;
		align-items: center;
		letter-spacing: 1px;
		font-size: 14px;
		line-height: 21px;
		border: 1px solid;
		margin-top: 15px;
		color: #ffffff;
		background-color: #245490;
		border-color: #245490;
		text-decoration: none;
	}

	.articlesBanner {
		width: 100%;
		height: 900px;
		background-image: url('/blog-bg.jpg');
	}
	.articleContent {
		max-width: 1440px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.upperContent {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.upperContent p:first-child {
		font-size: 35px;
	}
	.upperContent p:last-child {
		font-size: 25px;
	}
	.seeMoreButton {
		padding: 10px 20px;
		text-decoration: none;
		color: white;
		background: #245490;
	}
	.seeMoreButton:hover {
		background-color: white;
		color: #245490;
	}
	.magArticlesDesktop {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 10px;
		display: block;
	}
	.magArticlesMobile {
		display: none;
		margin-top: 20px;
	}
	.lowerContent {
		display: flex;
		justify-content: center;
		margin-top: 30px;
		gap: 15px;
	}
	.leftSide {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 50%;
		gap: 20px;
	}
	.rightSide {
		width: 50%;
	}
	.rightArticle {
		display: flex;
		flex-direction: column;
	}
	.rightArticleCardImage {
		max-height: 280px;
		width: 100%;
		max-width: 100%;
		object-fit: cover;
		object-position: center;
	}
	.magHeading {
		font-size: 19px;
		line-height: 26px;
		font-weight: 600;
	}
	.rightArticleText {
		background-color: white;
		padding: 20px 24px;
		margin-top: -5px;
	}
	.articleCard {
		display: flex;
	}
	.articleImage {
		width: 55%;
	}
	.articleCardImage {
		height: 100%;
		max-width: 100%;
		object-fit: cover;
		object-position: center;
	}
	.articleText {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background-color: white;
		width: 45%;
		padding: 20px;
	}
	.featuredProducts {
		margin-top: 40px;
	}

	.featuredProductsTitle {
		font-size: 35px;
		color: #373735;
		display: flex;
		justify-content: start;
		margin: 0 auto;
		width: 83%;
	}

	.link {
		text-decoration: underline;
		font-weight: 600;
		font-size: 13px;
		line-height: 20px;
		padding-top: 15px;
		color: black;
	}

	.mobileArticle {
		width: 90%;
		padding-right: 20px;
	}
	.mobileArticleImage {
		height: 350px;
	}
	.img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
		max-width: 100%;
	}
	.mobArticleLink {
		text-decoration: none;
		color: black;
	}
	.mobileArticleContent {
		background: #fff;
		padding: 22px 25px;
	}
	.heading {
		font-size: 19px;
		line-height: 26px;
		font-weight: 700;
		margin: 0 0 12px 0;
	}
	.articleExcerpt {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		font-size: 14px;
		line-height: 21px;
		font-style: italic;
		font-weight: 400;
	}
	.articleExcerpt p {
		margin: 0;
	}
	.read {
		text-decoration: underline;
		font-weight: 600;
		font-size: 13px;
		line-height: 20px;
		padding-top: 15px;
	}
	@media screen and (min-width: 1440px) {
		.content {
			bottom: -2px;
		}
	}
	@media screen and (min-width: 1441px) {
		.coverText {
			left: 36%;
			top: 37%;
		}
	}
	@media (max-width: 1024px) {
		.firstImage {
			width: 48%;
		}
		.secondImage {
			width: 48%;
		}
		.content {
			max-width: 482px;
		}
		.coverText {
			left: 34%;
			top: 32%;
		}
		.imageText {
			font-size: 50px;
		}
		.imageDescription {
			width: 90%;
		}
		.shopBtn {
			height: 45px;
			max-width: 140px;
		}
		.featuredProductsTitle {
			width: 85%;
		}
	}

	@media (min-width: 768px) {
		.firstImage:hover > .content {
			bottom: 50px;
		}

		.secondImage:hover > .content {
			bottom: 50px;
		}
		.card:hover > .collectionTitle {
			display: none;
		}
		.card:hover {
			margin-top: 20px;
		}
	}

	@media (max-width: 768px) {
		.firstImage {
			width: 100%;
		}
		.secondImage {
			width: 100%;
		}
		.button {
			display: none;
		}
		.buttonMobile {
			display: block;
			margin-top: 15px;
		}
		.card {
			width: 40%;
		}
		.collectionTitle {
			width: 100%;
			font-size: small;
			padding: 5px 0;
		}
		.product {
			width: 40%;
		}
		.cover {
			z-index: -1;
		}
		.imageText {
			font-size: 36px;
		}
		.imageDescription {
			font-size: 10px;
		}
		.shopBtn {
			max-width: 100px;
			height: 35px;
			font-size: 10px;
		}
		.content {
			max-width: none;
		}
		.magArticlesDesktop {
			display: none;
		}
		.magArticlesMobile {
			display: block;
			padding: 0 0 0 20px;
		}
		.articlesBanner {
			min-height: 900px;
		}
		.coverText {
			left: 34%;
		}
		.featuredProductsTitle {
			width: 100%;
			justify-content: center;
			margin-bottom: 40px;
		}
	}
	@media screen and (min-width: 400px) and (max-width: 500px) {
		.coverText {
			left: 37%;
		}
	}
	@media (max-width: 500px) {
		.products {
			gap: 0;
		}
		.product {
			width: 45%;
		}
		.card {
			width: 34%;
		}
		.firstImage {
			background-size: contain;
			background-position: unset;
			min-height: 475px;
		}
		.secondImage {
			background-size: contain;
			background-position: unset;
			min-height: 475px;
			margin-top: 10px;
		}
		.content {
			left: unset;
			transform: unset;
			padding: 20px;
			bottom: 0;
		}
		.contentTitle {
			font-size: 30px;
			margin: 10px;
		}
		.contentText {
			font-size: 12px;
		}
		.imageText {
			font-size: 18px;
		}
		.imageDescription {
			font-size: 5px;
		}
		.shopBtn {
			max-width: 70px;
			height: 25px;
			font-size: 10px;
		}

		.heading {
			min-height: 52px;
		}
		.featuredProducts {
			margin-top: 20px;
		}
		.featuredCollectionsTitle {
			padding-top: 20px;
			margin-bottom: 25px;
			font-size: 25px;
		}
		.featuredProductsTitle {
			font-size: 25px;
			margin-bottom: 20px;
		}
		.collectionTitle p {
			margin: 0;
		}
		.collections {
			gap: 10px;
		}
	}
	@media (max-width: 400px) {
		.coverText {
			left: 35%;
		}
		.shopBtn {
			max-width: 60px;
			height: 20px;
			font-size: 8px;
		}
	}
</style>
