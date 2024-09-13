<script>
	import { isQuickShopClosed } from './../stores/quickShop.js';
	import { onMount } from 'svelte';
	import QuickShop from '../components/QuickShop.svelte';
	import { register } from 'swiper/element/bundle';
	// register Swiper custom elements
	register();

	export let data;
	const collections = data.edges;
	const featuredImage = data.featuredImage;
	const featuredImageMobile = data.featuredImageMobile;
	console.log(featuredImageMobile);
	const imageText = data.imageText;
	const imageDescription = data.imageDescription;
	const formalCollectionProducts = data.formalCollectionProducts?.slice(2, 6);
	const saleCollectionProducts = data.saleCollectionProducts?.slice(2, 6);
	const kidsCollectionProducts = data.kidsCollectionProducts?.slice(1, 6);
	const articles = data.articles?.length > 4 ? data.articles?.slice(0, 4) : data.articles;
	$: isQuickShopClosedVal = true;
	isQuickShopClosed.subscribe((value) => {
		isQuickShopClosedVal = value;
	});
	$: quickShopProduct = null;
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
	$: activeTabId = 0;
	$: products =
		activeTabId === 0
			? formalCollectionProducts
			: activeTabId === 1
				? saleCollectionProducts
				: kidsCollectionProducts;
</script>

<svelte:head>
	<title>Home</title>
	<link rel="preconnect" href="https://images.ctfassets.net" />
</svelte:head>

<div class="cover">
	<img src={featuredImageMobile.url} alt="cover" class="coverImageMobile" />
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
					<a href={`/collections/${collection.node.handle}`} class="card">
						<img
							class="collectionImage"
							src={`${collection.node.image?.url}&width=300`}
							alt={collection.node.title}
						/>
						<div class="collectionTitle">
							<p>{collection.node.title}</p>
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</div>
</div>
<div class="ourFavSection">
	<div class="featuredProducts">
		<div class="bestSellersHeader">
			<div class="headerTitle">
				<h2>Our Favorites</h2>
			</div>
			<div class="collectionsDiv">
				<div class="customTabs">
					<button
						on:click={() => (activeTabId = 0)}
						class={activeTabId === 0 ? 'activeTab' : ''}
						aria-label="Formal">Formal</button
					>
					<button
						on:click={() => (activeTabId = 1)}
						class={activeTabId === 1 ? 'activeTab' : ''}
						aria-label="Sale">Sale</button
					>
					<button
						on:click={() => (activeTabId = 2)}
						class={activeTabId === 2 ? 'activeTab' : ''}
						aria-label="Kids">Kids</button
					>
				</div>
			</div>
			<div class="shopAll">
				<a href="/collections/men" class="shopAllLink {activeTabId === 0 ? '' : 'hidden'}"
					>Shop All</a
				>
				<a href="/collections/sale" class="shopAllLink {activeTabId === 1 ? '' : 'hidden'}"
					>Shop All</a
				>
				<a href="/collections/kid" class="shopAllLink {activeTabId === 2 ? '' : 'hidden'}"
					>Shop All</a
				>
			</div>
		</div>
		<div class="products">
			{#if products}
				{#each products as product}
					<a
						data-sveltekit-preload-data="hover"
						href={`/products/${product.handle}`}
						class="product"
						on:click={(event) => {
							if (
								event.target.closest('.quickShopBtnDesktop') ||
								event.target.closest('.quickShopBtnMobile')
							) {
								event.preventDefault();
							}
						}}
					>
						<div class="productImageContainer">
							<img
								src={`${product.featuredImage?.url}&width=300`}
								alt="Product"
								class="productImage primary"
								width="350px"
								height="425px"
							/>
							{#if product.media?.nodes?.length >= 2}
								<img
									src={`${product.media.nodes[1]?.previewImage.url}&width=300`}
									alt="Product"
									class="productImage secondary"
									width="350px"
									height="425px"
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
						<p class="productTitle">{product.title}</p>
					</a>
				{/each}
			{/if}
			{#if !isQuickShopClosedVal}
				<QuickShop product={quickShopProduct} />
			{/if}
		</div>
		<div class="shopAllMobile">
			<a href="/collections/men" class="shopAllLink {activeTabId === 0 ? '' : 'hidden'}">Shop All</a
			>
			<a href="/collections/sale" class="shopAllLink {activeTabId === 1 ? '' : 'hidden'}"
				>Shop All</a
			>
			<a href="/collections/kid" class="shopAllLink {activeTabId === 2 ? '' : 'hidden'}">Shop All</a
			>
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
			<a href="/collections/all" class="buttonText" aria-label="Shop Now">Shop Now</a>
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
			<a href="/collections/all" class="buttonText" aria-label="Shop Now">Shop Now</a>
		</div>
	</div>
</div>
<div class="articlesBanner">
	<div class="articleContent">
		<div class="upperContent">
			<div>
				<p>INS Mag</p>
				<p>With new articles added weekly, there is always more to discover</p>
			</div>
			<a href="/blogs/news" class="seeMoreButton">Explore</a>
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
								src={`${articles[0]?.image?.url}&width=350`}
								alt={articles[0]?.title}
								class="articleCardImage"
								loading="lazy"
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
								src={`${articles[1]?.image?.url}&width=350`}
								alt={articles[1]?.title}
								class="articleCardImage"
								loading="lazy"
							/>
						</div>
					</div>
				</div>
				<div class="rightSide">
					<div class="rightArticle">
						<div class="rightArticleImage">
							<img
								src={`${articles[2]?.image?.url}&width=400`}
								alt={articles[2]?.title}
								class="rightArticleCardImage"
								loading="lazy"
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
								src={`${articles[0]?.image?.url}&width=400`}
								alt={articles[0]?.title}
								class="img"
								loading="lazy"
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
								src={`${articles[1]?.image?.url}&width=400`}
								alt={articles[1]?.title}
								class="img"
								loading="lazy"
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
								src={`${articles[2]?.image?.url}&width=400`}
								alt={articles[2]?.title}
								class="img"
								loading="lazy"
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
	.ourFavSection {
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
	.coverImageMobile {
		display: none;
		object-fit: cover;
		max-height: 230px;
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
		text-decoration: none;
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
		position: relative;
	}
	.productImageContainer {
		position: relative;
		width: 350px;
		height: 425px;
	}
	.productImage {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		aspect-ratio: 4 / 5;
		object-fit: contain;
		transition: opacity 0.8s ease-in-out;
	}
	.productImage.primary {
		visibility: visible;
		opacity: 1;
	}
	.productImage.secondary {
		visibility: hidden;
		opacity: 0;
	}
	.product:hover .productImage.primary {
		opacity: 0;
		visibility: hidden;
	}
	.product:hover .productImage.secondary {
		opacity: 1;
		visibility: visible;
	}
	.quickShopBtnDesktop {
		font-family: 'Poppins';
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
		line-clamp: 3;
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
		background-image: url('/bg-1.webp');
		background-size: cover;
		min-height: 650px;
		width: 49.5%;
		background-repeat: no-repeat;
		background-position: center;
		position: relative;
	}
	.secondImage {
		background-image: url('/bg-2.webp');
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
		background-image: url('/blog-bg.webp');
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
		max-width: 1300px;
		margin: 0 auto;
		padding: 80px 0 40px;
	}

	.bestSellersHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20px;
		margin: 0 15px;
	}
	.headerTitle {
		width: 25%;
	}
	.headerTitle h2 {
		font-size: 35px;
		line-height: 49px;
		margin: 0;
		font-family: Poppins;
		font-weight: normal;
	}
	.collectionsDiv {
		width: 55%;
		text-align: center;
	}
	.customTabs button {
		background: none;
		line-height: 22px;
		font-size: 15px;
		text-transform: capitalize;
		padding: 10px;
		margin-right: 30px;
		min-width: 137px;
		min-height: 41px;
		border: 1px solid transparent;
		font-family: 'Poppins';
		cursor: pointer;
	}
	.activeTab {
		background: #245490 !important;
		color: #fff;
		padding: 10px;
	}
	.hidden {
		display: none;
	}
	.shopAll {
		width: 20%;
		text-align: right;
	}
	.shopAllMobile {
		display: none;
	}
	.shopAllLink {
		font-size: 13px;
		line-height: 20px;
		font-weight: 600;
		text-transform: uppercase;
		border-bottom: 2px solid;
		text-decoration: none;
		color: #000;
		font-family: Poppins;
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
		line-clamp: 3;
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
		.product:hover .quickShopBtnDesktop {
			bottom: 0px;
			opacity: 1;
			cursor: pointer;
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
		.quickShopBtnDesktop {
			display: none;
		}
		.quickShopBtnMobile {
			display: block;
		}
		.bestSellersHeader {
			flex-direction: column;
		}
		.headerTitle {
			width: 100%;
			text-align: center;
			margin-bottom: 15px;
		}
		.shopAll {
			display: none;
		}
		.shopAllMobile {
			display: flex;
			justify-content: center;
		}
		.collectionsDiv {
			display: flex;
			justify-content: center;
			width: 100%;
			padding: 0;
		}
		.collectionsDiv button {
			background-color: #f9e6e6;
			margin: 0 12px 0 0;
			min-height: unset;
			min-width: unset;
		}
		.collectionsDiv button:hover {
			background-color: #fff5f5;
		}
	}
	@media screen and (min-width: 400px) and (max-width: 500px) {
		.coverText {
			left: 37%;
		}
	}
	@media (max-width: 500px) {
		.coverImage {
			display: none;
		}
		.coverImageMobile {
			display: block;
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
		.collectionTitle p {
			margin: 0;
		}
		.collections {
			gap: 10px;
		}
		.productImageContainer {
			padding-top: 145%;
			width: 200px;
			height: 250px;
		}
		.quickShopBtnMobile {
			bottom: 2px;
			right: 18px;
		}
		.featuredCollectionsBackground {
			width: 100%;
			height: 530px;
		}
		.featuredCollections {
			width: 100%;
			height: 530px;
		}
		.featuredProducts {
			width: 100%;
			height: 900px;
		}
		.ourFavSection {
			width: 100%;
			height: 900px;
		}
		.ourFavSection .products {
			width: 100%;
			height: 630px;
		}
		.bgImagesWithText {
			width: 100%;
			height: 1110px;
		}
		.articlesBanner {
			width: 100%;
			height: 900px;
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
		.quickShopBtnMobile {
			right: 17px;
		}
	}
</style>
