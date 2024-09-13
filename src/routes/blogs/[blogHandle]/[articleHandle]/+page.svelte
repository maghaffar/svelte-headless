<script>
	import moment from 'moment';
	import QuickShop from '../../../../components/QuickShop.svelte';
	import { isQuickShopClosed } from '../../../../stores/quickShop';
	import { onMount } from 'svelte';
	export let data;
	$: article = data.article;
	$: popularArticles = data.popularArticles.slice(0, 5);
	$: moreArticles = data.popularArticles;
	$: formattedDate = moment(article?.publishedAt).format('MMMM YYYY');
	$: collectionProducts = data.collectionProducts;
	$: dataFetched = true;
	if (!article) {
		dataFetched = false;
	}

	$: isQuickShopClosedVal = true;
	isQuickShopClosed.subscribe((value) => {
		isQuickShopClosedVal = value;
	});
	$: quickShopProduct = null;

	onMount(() => {
		// NEW ARRIVALS SLIDER
		const flkty = new Flickity('.blogCollectionMainDiv', {
			cellAlign: 'left',
			contain: true,
			pageDots: false
		});

		const prevArrow = document.querySelector(
			'.blogCollectionMainDiv>.flickity-prev-next-button.previous'
		);
		const nextArrow = document.querySelector(
			'.blogCollectionMainDiv>.flickity-prev-next-button.next'
		);
		const arrows = Array.from(
			document.querySelectorAll(
				'.blogCollectionMainDiv>.flickity-prev-next-button .flickity-button-icon'
			)
		);
		const flickityButton = Array.from(
			document.querySelectorAll('.blogCollectionMainDiv>.flickity-button')
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
		nextArrow.style.bottom = '0px';
		prevArrow.style.bottom = '0px';
		nextArrow.style.left = '55%';
		nextArrow.style.width = '30px';
		nextArrow.style.height = '30px';
		prevArrow.style.width = '30px';
		prevArrow.style.height = '30px';

		const updateArrowPosition = () => {
			if (window.matchMedia('(max-width: 480px)').matches) {
				prevArrow.style.left = '35%';
			} else {
				prevArrow.style.left = '45%';
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
	<title>{article.title}</title>
</svelte:head>

<div class="container">
	<div class="containerFluid pxLg px">
		<div class="col pxLg px">
			<div class="row noMargin blogMain">
				<div class="blogLeft">
					<div class="article">
						<div>
							<div class="pb">
								<div class="containerFluid px">
									<div class="row justifyCenter noMargin">
										<div class="colLg pxLg px">
											<div class="mb textCenter">
												<div class="blogTitle">{article?.blog.title}</div>
												<div class="articleTitle">
													{article?.title}
												</div>
												<div class="excerpt">
													<p>{@html article?.excerptHtml}</p>
												</div>
												<div class="author">
													{article?.authorV2?.name}
												</div>
												<div class="date">
													{formattedDate}
												</div>
											</div>
										</div>
										<div class="colLg2 pxLg px">
											<div class="responsive">
												<div class="responsiveItem">
													<img
														src="{article?.image?.url}&width=900"
														alt={article?.title}
														class="articleImage"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="customData">
							{@html article?.contentHtml}
						</div>
					</div>
					<div>
						<div class="containerFluid pxLg">
							<div class="row noMargin">
								<div class="col colLg2 px mAuto">
									<div class="newArrival">New Arrivals</div>
								</div>
							</div>
							<div class="row noMargin">
								<div class="col colLg2 px mAuto" style="margin-top: 0px;">
									<div class="row noMargin blogCollectionBtnDiv">
										<div class="pxLg3 px colAuto">
											<div class="textCenter m0">
												<a
													href="/collections/sale"
													data-sveltekit-preload-data="hover"
													class="shopAll">Shop All</a
												>
											</div>
										</div>
									</div>
									<div class="blogCollectionMainDiv">
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
																	data-sveltekit-preload-data="hover"
																>
																	<div class="mb2 responsive">
																		<div class="responsiveItem primary">
																			<img
																				src={`${product.featuredImage?.url}&width=400`}
																				alt="Product"
																			/>
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
																					<line
																						class="qshbtn"
																						x1="40.5"
																						y1="36.47"
																						x2="40.5"
																						y2="48.52"
																					></line>
																					<line
																						class="qshbtn"
																						x1="46.52"
																						y1="42.5"
																						x2="34.47"
																						y2="42.5"
																					></line>
																				</g>
																			</g>
																		</g>
																	</svg>
																</button>
															</div>
															<div class="title">
																<a href="/products/{product.handle}">{product.title}</a>
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
					</div>
				</div>
				<div class="blogRight">
					<div>
						<div class="founder">
							<img src="/magFounder.jpg" alt="mag founder" width="335px" height="335px" />
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
	<div class="articles">
		<div class="py my">
			<div class="containerFluid pxLg px">
				<div class="row noMargin">
					<div class="col pxLg px">
						<hr class="borderDark" />
						<div class="heading">More Stories</div>
					</div>
				</div>
				<div class="row noMargin">
					<div class="col pxLg2 p0">
						<div class="row noMargin">
							{#each moreArticles as article}
								<div class="articleMain pxLg3 px">
									<div class="mb5 textCenter">
										<a href="/blogs/{article.blog.handle}/{article.handle}">
											<div class="responsive mb">
												<div class="responsiveItem">
													<img src="{article.image.url}&width=390" alt={article.title} />
												</div>
											</div>
										</a>
										<div class="articleBlog">{article.blog.title}</div>
										<div class="articleTitle">
											<a href="/blogs/{article.blog.handle}/{article.handle}">{article.title}</a>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
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
	.justifyCenter {
		justify-content: center;
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
	.colAuto {
		flex: 0 0 auto;
		position: relative;
		width: auto;
		max-width: 100%;
	}
	.px {
		padding-right: 0.5rem;
		padding-left: 0.5rem;
		margin-top: 0.5rem;
	}
	.mAuto {
		margin: 0 auto;
	}
	.pb {
		padding-bottom: 1.5rem;
	}
	.p0 {
		padding: 0;
	}
	.m0 {
		margin: 0;
	}
	.mb {
		margin-bottom: 1.5rem;
	}
	.mb5 {
		margin-bottom: 0.5rem;
	}
	.py {
		padding-top: 0;
		padding-bottom: 1.5rem;
	}
	.my {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}
	.blogLeft {
		width: 70%;
		padding: 0 20px;
	}
	.article {
		padding-bottom: 40px;
		margin-bottom: 0;
	}
	.colLg {
		position: relative;
		width: 100%;
		flex: 0 0 91%;
		max-width: 91%;
	}
	.colLg2 {
		position: relative;
		width: 100%;
		flex: 0 0 100%;
		max-width: 100%;
	}
	.textCenter {
		text-align: center;
	}
	.blogTitle {
		font-weight: 400;
		font-size: 17px;
		line-height: 1rem;
		font-style: italic;
		padding-bottom: 1rem;
		margin-bottom: 1rem;
		text-align: center;
	}
	.articleTitle {
		font-size: 32px;
		font-weight: 400;
		line-height: 1.8rem;
		margin-bottom: 1rem;
		margin-top: 0;
		color: #373735;
	}
	.excerpt {
		font-size: 14px;
		font-weight: 400;
		line-height: 1rem;
		margin-bottom: 1rem;
		text-align: center;
	}
	.author {
		font-size: 14px;
		font-style: italic;
		font-weight: 400;
		line-height: 1rem;
		margin-bottom: 1rem;
		text-align: center;
	}
	.responsive {
		margin-bottom: 0.5rem;
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		overflow: hidden;
	}
	.responsive::before {
		padding-top: 56%;
		display: block;
		content: '';
	}
	.responsiveItem {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.responsiveItem img {
		width: 100%;
		max-width: 100%;
		border-style: none;
		vertical-align: middle;
	}
	.articleImage {
		max-width: 100%;
		width: 100%;
	}
	.customData {
		font-family: 'Poppins';
		font-size: 16px;
		width: 100%;
		text-align: justify;
		padding-left: 40px;
		padding-right: 40px;
		letter-spacing: 1px;
		line-height: 2rem;
	}
	.borderDark {
		border: 0;
		border-top: 1px solid #373735;
		box-sizing: content-box;
		margin: 0;
	}
	.heading {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		font-family: 'Poppins, serif';
		letter-spacing: 1px;
		line-height: 1rem;
		font-weight: 400;
		font-size: 20px;
		text-align: center;
		color: #373735;
	}
	.articleMain {
		position: relative;
		width: 100%;
		flex: 0 0 50%;
		max-width: 50%;
	}

	.articleMain .responsive::before {
		padding-top: 71%;
		display: block;
		content: '';
	}
	.articleBlog {
		font-family: 'Poppins';
		line-height: 1rem;
		font-weight: 400;
		font-size: 14px;
		font-style: italic;
		margin-top: 1.5rem;
		text-align: center;
		color: #495057;
	}
	.articleTitle a {
		text-decoration: none;
		color: #373735;
		font-weight: 400;
		font-size: 16px;
		line-height: 1rem;
		font-family: 'Poppins, serif';
	}
	.newArrival {
		font-size: 20px;
		font-weight: 400;
		line-height: 1rem;
		font-family: 'Poppins, serif';
		text-align: center;
		background: #f8f5f1;
		padding-top: 20px;
	}
	.blogCollectionBtnDiv {
		background: #f8f5f1;
		padding-top: 0.5rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.shopAll {
		font-family: 'Poppins, serif';
		background: none;
		color: #ce7243;
		font-size: 16px;
		border: none;
		padding: 0 0 12px;
		font-weight: 400;
		line-height: 1rem;
		cursor: pointer;
		text-decoration: none;
		letter-spacing: 1px;
	}
	.blogCollectionMainDiv {
		background: #f8f5f1;
		padding-bottom: 70px;
	}
	.productMainDiv {
		width: 100%;
		max-width: 50%;
	}
	.paddingX2 {
		margin-top: 0.5rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
	.mb2 {
		margin-bottom: 0.5rem;
	}
	.quickShopHover {
		position: relative;
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
	.blogCollectionMainDiv .responsive::before {
		padding-top: 125%;
		display: block;
		content: '';
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
	/* This is the CSS of Right Side Founder Bar */
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
	@media screen and (min-width: 992px) {
		.pxLg {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
			margin-top: 0.5rem;
		}
		.pxLg2 {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}
		.pxLg3 {
			padding-left: 1rem;
			padding-right: 1rem;
		}
		.articleMain {
			flex: 0 0 33.3%;
			max-width: 33.3%;
		}
		.colLg2 {
			flex: 0 0 100%;
			max-width: 100%;
			position: relative;
			width: 100%;
		}
		.productMainDiv {
			max-width: 33.3%;
		}
		.paddingXLg {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
	}
	@media screen and (min-width: 768px) {
		.quickShopHover:hover .quickShopBtnDesktop {
			bottom: 0px;
			opacity: 1;
			cursor: pointer;
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
		.blogMain {
			flex-direction: column;
		}
		.blogLeft {
			width: 100%;
		}
		.blogRight {
			width: 100%;
			border-top: 2px solid #db9776;
			padding-top: 10px;
			margin-top: 20px;
		}
	}
	@media screen and (max-width: 480px) {
		.quickShopBtnMobile {
			width: 30px;
			height: 30px;
		}
		.quickShopBtnMobile svg {
			width: 20px;
			height: 20px;
		}
		.customData {
			font-size: 12px;
			line-height: 1.5rem;
			/* letter-spacing: 0.5px; */
		}
		.sideBarText p {
			font-size: 12px;
		}
		.articleTitle a {
			font-size: 12px;
		}
	}
</style>
