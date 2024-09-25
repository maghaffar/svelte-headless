<script>
	import { onMount } from 'svelte';
	import QuickShop from '../../../components/QuickShop.svelte';
	import { isQuickShopClosed } from '../../../stores/quickShop';
	export let data;
	$: articles = data.articles;
	$: popularArticles = data.popularArticles?.slice(0, 7);
	$: blog = data.blog;
	$: blogs = data.blogs;
	$: collectionProducts = data.collectionProducts;

	$: isQuickShopClosedVal = true;
	isQuickShopClosed.subscribe((value) => {
		isQuickShopClosedVal = value;
	});
	$: quickShopProduct = null;

	onMount(() => {
		// NEW ARRIVALS SLIDER
		const flkty = new Flickity('.collectionMainDiv', {
			cellAlign: 'left',
			contain: true,
			pageDots: false
		});

		const prevArrow = document.querySelector(
			'.collectionMainDiv>.flickity-prev-next-button.previous'
		);
		const nextArrow = document.querySelector('.collectionMainDiv>.flickity-prev-next-button.next');
		const arrows = Array.from(
			document.querySelectorAll(
				'.collectionMainDiv>.flickity-prev-next-button .flickity-button-icon'
			)
		);
		const flickityButton = Array.from(
			document.querySelectorAll('.collectionMainDiv>.flickity-button')
		);

		flickityButton.forEach((button) => {
			button.style.boxShadow = 'unset';
		});
		arrows.forEach((arrow) => {
			arrow.style.width = '18px';
			arrow.style.height = '18px';
		});
		prevArrow.style.top = 'unset';
		nextArrow.style.top = 'unset';
		nextArrow.style.left = '55%';
		prevArrow.style.bottom = '-20px';
		nextArrow.style.bottom = '-20px';

		// READ MORE ARTICLES SLIDER
		const flkty1 = new Flickity('.readMoreArticlesMainDiv', {
			cellAlign: 'left',
			contain: true,
			pageDots: false,
			freeScroll: true,
			wrapAround: true
		});

		const arrowss = Array.from(
			document.querySelectorAll(
				'.readMoreArticlesMainDiv>.flickity-prev-next-button .flickity-button-icon'
			)
		);
		const flickityBtn = Array.from(
			document.querySelectorAll('.readMoreArticlesMainDiv>.flickity-button')
		);
		const prevNextBtn = Array.from(
			document.querySelectorAll('.readMoreArticlesMainDiv>.flickity-prev-next-button')
		);
		const prevNextBtnIcon = Array.from(
			document.querySelectorAll(
				'.readMoreArticlesMainDiv>.flickity-prev-next-button .flickity-button-icon'
			)
		);

		prevNextBtn.forEach((btn) => {
			btn.style.width = '30px';
			btn.style.height = '30px';
		});
		flickityBtn.forEach((btn) => {
			btn.style.boxShadow = 'unset';
		});
		arrowss.forEach((arrow) => {
			arrow.style.width = '18px';
			arrow.style.height = '18px';
		});

		const updateArrowPosition = () => {
			if (window.matchMedia('(max-width: 480px)').matches) {
				prevArrow.style.left = '35%';
				prevNextBtn.forEach((btn) => {
					btn.style.width = '25px';
					btn.style.height = '25px';
					btn.style.top = '30%';
				});
				prevNextBtnIcon.forEach((icon) => {
					icon.style.top = '17%';
					icon.style.left = '17%';
				});
			} else {
				prevArrow.style.left = '45%';
				prevNextBtn.forEach((btn) => {
					btn.style.top = '40%';
					btn.style.right = '18px';
				});
			}
		};

		updateArrowPosition();
		window.addEventListener('resize', updateArrowPosition);

		return () => {
			// Cleanup event listener when component is destroyed
			window.removeEventListener('resize', updateArrowPosition);
		};
	});
</script>

<svelte:head>
	<title>Intangible Mag</title>
</svelte:head>

<div class="container paddingLeftRight pxLg">
	<div class="containerFluid">
		<div class="row noMargin">
			<div class="col paddingLeftRight pxLg">
				<h1 class="blogTitle marginY paddingY">Intangible Mag</h1>
				<div class="row noMargin justifyContentCenter">
					{#each blogs as blog}
						<div class="blogMenuItem">
							<div class="blogMenuCustom">
								<a href="/blogs/{blog.handle}" data-sveltekit-preload-data="hover">{blog.title}</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="containerFluid paddingLeftRight pxLg articles">
		<div class="col paddingLeftRight pxLg">
			<div class="row noMargin articlesMob">
				<div class="blogLeft">
					<div>
						{#each articles.nodes as article}
							<div class="blogArticle">
								<p class="tagTitle">{blog.title}</p>
								<a href="/blogs/{blog.handle}/{article.handle}" class="articleTitle"
									>{article.title}</a
								>
								<p class="author">By {article.authorV2?.name}</p>
								<a href="/blogs/{blog.handle}/{article.handle}">
									<img
										src={`${article.image?.url}&width=900`}
										alt={article.title}
										class="articleImage"
									/>
								</a>
								<div class="articleDescription">
									<p>{@html article.excerptHtml}</p>
								</div>
								<a href="/blogs/{blog.handle}/{article.handle}" class="readMore">Read more</a>
							</div>
						{/each}
					</div>
				</div>
				<div class="blogRight">
					<div>
						<div class="founder">
							<img src="/magFounder.webp" alt="mag founder" width="335px" height="335px" />
							<div class="sideBarText">
								<p>
									<em><strong>INS MAG: </strong></em>Founder Amy Voloshin is passionate about
									creating a space that speaks to our brand, shares unique perspectives from pattern
									enthusiasts and finds ways to promote more sustainable living. Our blog
									<a href="/blogs/news" title="/blogs/news"><strong>INS Mag </strong></a>covers
									creative topics on all things lifestyle - including behind the scenes looks,
									fashion, design, travel, and home decor, as well as interviews with some of the
									people who inspire us most.&nbsp;
								</p>
							</div>
						</div>
						<div class="newsletter">
							<h6>JOIN OUR COMMUNITY</h6>
							<form>
								<div class="mb4">
									<div class="newsletterText">
										<p>
											Stay inspired with thoughtful interviews, design and DIY ideas, recipes,
											shopping tips, and so much more.
										</p>
									</div>
								</div>
								<div class="formGroup">
									<div class="inputGroup">
										<input type="email" name="email" placeholder="Email" class="formControl" />
										<div class="inputGroupAppend">
											<button class="btnSubmit" aria-label="Join">JOIN</button>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div class="popularSection">
							<p class="sectionTitle">Most Popular Articles</p>
							<p class="sectionText">This Month</p>
							{#each popularArticles as article, i}
								<div class="articleRow">
									<span class="articleNumber">{i + 1}</span>
									<a
										href="/blogs/{article.blog.handle}/{article.handle}"
										data-sveltekit-preload-data="hover"
									>
										<p>{article.title}</p>
									</a>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="containerFluid paddingLeftRight pxLg">
		<div class="row noMargin">
			<div class="col paddingLeftRight pxLg">
				<div class="collectionHeading marginY-4">New Arrivals</div>
			</div>
		</div>
		<div class="row noMargin">
			<div class="col pxLg padding0">
				<div class="collectionMainDiv">
					{#if collectionProducts.nodes}
						{#each collectionProducts.nodes as product}
							<div class="productMainDiv paddingXLg paddingX2">
								<div>
									<div class="mb2 quickShopHover">
										<div class="positionRelative">
											<a
												href="/products/{product.handle}"
												on:click={(event) => {
													if (
														event.target.closest('.quickShopBtnDesktop') ||
														event.target.closest('.quickShopBtnMobile')
													) {
														event.preventDefault();
													}
												}}
												data-sveltekit-reload
											>
												<div class="mb2 responsive">
													<div class="responsiveItem primary">
														<img src={`${product.featuredImage?.url}&width=300`} alt="Product" />
													</div>
													<div class="responsiveItem secondary">
														<img
															src={`${product.media.nodes[1]?.previewImage.url}&width=300`}
															alt="Product"
														/>
													</div>
												</div>
											</a>
											<button
												class="quickShopBtnDesktop"
												aria-hidden={isQuickShopClosedVal ? 'false' : 'true'}
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
												aria-hidden={isQuickShopClosedVal ? 'false' : 'true'}
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
																<line class="qshbtn" x1="40.5" y1="36.47" x2="40.5" y2="48.52"
																></line>
																<line class="qshbtn" x1="46.52" y1="42.5" x2="34.47" y2="42.5"
																></line>
															</g>
														</g>
													</g>
												</svg>
											</button>
										</div>
										<div class="title">
											<a href="/products/{product.handle}" data-sveltekit-reload>{product.title}</a>
										</div>
									</div>
								</div>
							</div>
						{/each}
						{#if !isQuickShopClosedVal}
							<QuickShop product={quickShopProduct} />
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="containerFluid paddingLeftRight pxLg">
		<div class="row noMargin">
			<div class="col paddingLeftRight pxLg">
				<div class="collectionHeading marginY-4">Read More</div>
			</div>
		</div>
		<div class="row noMargin">
			<div class="col paddingLeftRight pxLg">
				<div class="readMoreArticlesMainDiv">
					{#each popularArticles as article}
						<div class="article paddingXLg paddingX2">
							<a href="/blogs/{article.blog.handle}/{article.handle}">
								<div>
									<div class="mb2 responsive">
										<div class="responsiveItem">
											<img src="{article.image?.url}&width=400" alt={article.title} />
										</div>
									</div>
								</div>
								<div class="title">{article.title}</div>
								<div class="blog">{article.blog.title}</div>
							</a>
						</div>
					{/each}
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
	.containerFluid {
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
	}
	.noMargin {
		margin-left: 0;
		margin-right: 0;
	}
	.col {
		flex-basis: 0;
		flex-grow: 1;
		max-width: 100%;
		position: relative;
		width: 100%;
	}
	.paddingLeftRight {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
	.blogTitle {
		font-size: 37px;
		font-style: italic;
		letter-spacing: 4px;
		font-weight: 600;
		line-height: 1rem;
		text-align: center;
		font-family: 'Poppins, serif';
	}
	.mb4 {
		margin-bottom: 1.5rem;
	}
	.mb2 {
		margin-bottom: 0.5rem;
	}
	.marginY-4 {
		margin-bottom: 1.5rem;
		margin-top: 1.5rem;
	}
	.marginY {
		margin-bottom: 1rem;
		margin-top: 1rem;
	}
	.paddingY {
		padding-bottom: 1rem;
		padding-top: 1rem;
	}
	.paddingX2 {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
	.padding0 {
		padding: 0 !important;
	}
	.justifyContentCenter {
		justify-content: center;
	}
	.blogMenuItem {
		width: 33%;
		text-align: center;
		padding: 0 10px;
		margin-bottom: 15px;
	}
	.blogMenuCustom {
		background: #f8f5f1;
		padding: 6px 0;
	}
	.blogMenuCustom > a {
		text-transform: uppercase;
		font-size: 15px;
		color: #171e24;
		text-decoration: none;
	}
	.articles {
		margin-top: 30px;
		border-bottom: 2px solid #db9776;
		margin-bottom: 30px;
		padding-bottom: 10px;
	}
	.blogLeft {
		width: 70%;
		padding: 0 20px;
	}
	.blogArticle {
		margin-bottom: 35px;
		padding-bottom: 45px;
		border-bottom: 2px solid #db9776;
	}
	.tagTitle {
		font-size: 15px;
		text-transform: uppercase;
		margin-bottom: 5px;
		margin-top: 0;
		font-family: 'Poppins';
	}
	.articleTitle {
		outline: none;
		cursor: pointer;
		font-size: 32px;
		color: #373735;
		text-decoration: none;
		background-color: transparent;
		font-family: 'Poppins';
	}
	.author {
		font-size: 14px;
		font-style: italic;
		font-family: 'Poppins';
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.articleImage {
		max-width: 100%;
		vertical-align: middle;
		border-style: none;
	}
	.articleDescription {
		margin-top: 30px;
	}
	.articleDescription p {
		font-size: 16px;
		line-height: normal;
		font-family: 'Poppins';
		margin-top: 0;
		margin-bottom: 1rem;
		font-weight: 400;
	}
	.readMore {
		background: #f8f5f1;
		padding: 12px 9px;
		text-transform: uppercase;
		font-size: 12px;
		margin-top: 10px;
		display: inline-block;
		outline: none;
		color: #373735;
		text-decoration: none;
		font-family: 'Poppins';
	}
	.blogRight {
		width: 30%;
		padding: 0 20px;
	}
	.founder {
		width: 100%;
	}
	.founder img {
		width: 100%;
		max-width: 100%;
		vertical-align: middle;
		border-style: none;
		object-fit: cover;
	}
	.sideBarText p {
		font-size: 15px;
		line-height: normal;
		text-align: justify;
		margin-top: 15px;
		font-family: 'Poppins';
		margin-bottom: 1rem;
	}
	.newsletter {
		border: 2px solid #db9776;
		padding: 25px 20px 35px;
		margin-top: 16px;
		text-align: center;
		display: inline-block;
		width: 100%;
	}
	.newsletter h6 {
		color: #ce7243;
		font-size: 1rem;
		margin-top: 0.5rem;
		font-weight: 500;
		line-height: 1.2;
	}
	.newsletterText {
		line-height: normal;
		font-style: italic;
		font-weight: 400;
		font-size: 14px;
		margin-bottom: 1rem;
		text-align: center;
	}
	.newsletterText p {
		font-family: 'Poppins';
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.formGroup {
		margin-bottom: 0;
	}
	.inputGroup {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		width: 92%;
	}
	.formControl {
		position: relative;
		flex: 1 1 auto;
		width: 1%;
		min-width: 0;
		margin-bottom: 0;
		line-height: 1rem;
		font-size: 1.2rem;
		padding-left: 0;
		height: auto;
		border-color: #373735;
		border-left: 0;
		border-right: 0;
		border-top: 0;
		background-color: transparent;
		display: block;
		padding: 5px 15px 0 0;
		color: #495057;
		background-clip: padding-box;
		border-radius: 0;
		transition:
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
		margin: 0;
		border-bottom: 1px solid #ced4da;
	}
	.inputGroupAppend {
		margin-left: -1px;
		display: flex;
	}
	.btnSubmit {
		color: #ce7343;
		background-color: transparent;
		position: relative;
		z-index: 2;
		letter-spacing: 1px;
		line-height: 1rem;
		font-size: 13px;
		font-family: 'Poppins';
		border: none;
		padding-right: 0;
		height: auto;
	}
	.popularSection {
		background: #f8f5f1;
		padding: 30px 20px;
		margin-top: 40px;
		display: inline-block;
		width: 100%;
	}
	.sectionTitle {
		text-align: center;
		margin-bottom: 0;
		margin-top: 0;
		font-family: 'Poppins';
		font-size: 20px;
		border-bottom: 1px solid black;
	}
	.sectionText {
		text-align: center;
		font-size: 15px;
		font-style: italic;
		margin-top: 5px;
		margin-bottom: 1rem;
		font-family: 'Poppins';
	}
	.articleRow {
		display: flex;
		align-items: baseline;
		margin-bottom: 20px;
	}
	.articleNumber {
		font-size: 25px;
		color: #ce7144;
		margin-right: 5px;
	}
	.articleRow a {
		outline: none;
		color: #373735;
		text-decoration: none;
		background-color: transparent;
		font-family: 'Poppins';
	}
	.articleRow a p {
		font-size: 14px;
		margin-bottom: 0;
		line-height: normal;
		font-family: 'Poppins';
		margin-top: 0;
		color: #373735;
	}
	.collectionHeading {
		font-size: 20px;
		font-weight: 400;
		line-height: 1rem;
		font-family: 'Poppins';
		text-align: center;
		color: #373735;
	}
	.collectionMainDiv {
		padding-bottom: 50px;
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
	.productMainDiv {
		width: 100%;
		max-width: 50%;
	}
	.quickShopHover {
		position: relative;
	}
	.positionRelative {
		position: relative;
	}
	.responsive {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		overflow: hidden;
	}
	.responsive::before {
		padding-top: 125%;
		display: block;
		content: '';
	}
	.responsiveItem {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		border: 0;
		width: 100%;
		height: 100%;
	}
	.responsiveItem img {
		width: 100%;
		max-width: 100%;
		border-style: none;
		vertical-align: middle;
	}
	.secondary {
		display: none;
	}
	.quickShopHover:hover .primary {
		display: none;
	}
	.quickShopHover:hover .secondary {
		display: block;
	}
	.title a {
		font-family: 'Poppins';
		font-size: 13px;
		font-weight: 400;
		line-height: 0.8rem;
		margin-bottom: 0.5rem;
		text-decoration: none;
		color: #373735;
		margin-top: 10px;
	}
	.article {
		width: 100%;
		max-width: 50%;
	}
	.article a {
		text-decoration: none;
		color: #373735;
		text-align: center;
	}
	.article .responsive::before {
		padding-top: 67%;
		display: block;
		content: '';
	}
	.blog {
		color: #ce7243;
		margin-bottom: 5px;
		text-transform: uppercase;
		font-size: 14px;
		font-family: 'Poppins';
		margin-top: 0;
	}
	@media screen and (min-width: 768px) {
		.quickShopHover:hover .quickShopBtnDesktop {
			bottom: 0px;
			opacity: 1;
			cursor: pointer;
		}
	}
	@media screen and (min-width: 992px) {
		.pxLg {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		.paddingXLg {
			padding-left: 1rem;
			padding-right: 1rem;
		}
		.productMainDiv {
			max-width: 25%;
		}
		.article {
			max-width: 25%;
		}
	}

	@media screen and (max-width: 768px) {
		.quickShopBtnDesktop {
			display: none;
		}
		.quickShopBtnMobile {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.articlesMob {
			flex-direction: column;
		}
		.blogLeft {
			width: 100%;
		}
		.blogRight {
			width: 100%;
		}
	}

	@media screen and (max-width: 500px) {
		.quickShopBtnMobile {
			width: 30px;
			height: 30px;
		}
		.quickShopBtnMobile svg {
			width: 20px;
			height: 20px;
		}
		.articleDescription {
			font-size: 14px;
		}
		.articleTitle {
			font-size: 28px;
		}
		.tagTitle {
			font-size: 12px;
		}
		.sideBarText p {
			font-size: 14px;
		}
		.blogTitle {
			font-size: 32px;
			letter-spacing: 3px;
		}
		.blogMenuCustom a {
			font-size: 14px;
		}
		.blogMenuItem {
			padding: 0;
			width: 100%;
		}
	}
</style>
