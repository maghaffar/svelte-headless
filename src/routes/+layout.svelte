<script>
	import { isCartUpdated } from './../stores/cart.js';
	import { invalidateAll } from '$app/navigation';
	import { cartLinesUpdate } from '../utils.js';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	// register Swiper custom elements
	register();

	export let data;
	const menuItems = data.menuItems ? data.menuItems : [];
	const customHeaderItems = data.customHeaderItems;
	$: openCustomSearchBar = false;
	let openIndex = -1;
	let isActive1 = false;
	let isActive2 = false;
	let isActive3 = false;
	$: searchResults = [];
	$: collections = [];
	$: query = '';
	let timeout;
	const popularSearches = ['red dress', 'shirt', 'striped peplum', 'night dress'];

	async function searchProducts() {
		clearTimeout(timeout);
		if (query.length > 0) {
			timeout = setTimeout(async () => {
				const res = await fetch('/api/search', {
					method: 'POST',
					body: JSON.stringify({
						query
					})
				});
				const data = await res.json();
				searchResults = data?.predictiveSearch?.products;
				collections = data?.predictiveSearch?.collections;
			}, 250);
		} else {
			searchResults = [];
		}
	}

	$: if (query.length == 0) searchResults = [];

	$: isCartUpdatedValue = false;
	isCartUpdated.subscribe((value) => {
		isCartUpdatedValue = value;
	});

	$: cart = data.cart;
	$: totalQuantity = cart?.totalQuantity;
	$: freeShippingDiff = (195 - cart?.cost?.subtotalAmount.amount).toFixed(2);
	$: progressPercent = (cart?.cost?.subtotalAmount.amount / 195) * 100;
	$: cartId = data.cartId;
	$: console.log(cartId);
	$: code = '';
	$: appliedCodes = [];
	$: discountedAmount = 0;
	$: lines = cart?.lines;
	$: checkoutUrl = cart?.checkoutUrl;
	$: merchandise = lines?.edges.map((line) => {
		return line.node.merchandise;
	});
	let lineIds = [];
	let note = '';

	$: if (cart) {
		discountedAmount = 0;
		if (cart.discountAllocations?.length > 0) {
			cart.discountAllocations.forEach((discountAllocation) => {
				discountedAmount += parseInt(discountAllocation.discountedAmount.amount);
			});
		}
		if (cart?.discountCodes) {
			appliedCodes = [];
			cart.discountCodes.forEach((discountCode) => {
				if (discountCode?.applicable && !appliedCodes.includes(discountCode.code)) {
					appliedCodes = [...appliedCodes, discountCode.code];
				}
			});
		}
	}

	async function remove() {
		const res = await fetch('/api/removeLines', {
			method: 'POST',
			body: JSON.stringify({
				lineIds
			})
		});
		const removed = await res.json();
		if (removed) {
			invalidateAll();
		}
	}

	let id = '';
	let quantity;
	let isUpdatingQuantity = false;
	async function handleIncrement() {
		isUpdatingQuantity = true;
		quantity = quantity + 1;
		const data = await cartLinesUpdate(cartId, id, quantity);
		if (!data.errors) {
			invalidateAll();
		}
		isUpdatingQuantity = false;
	}
	async function handleDecrement() {
		isUpdatingQuantity = true;
		quantity = quantity - 1;
		if (quantity > 0) {
			const data = await cartLinesUpdate(cartId, id, quantity);
			if (!data.errors) {
				invalidateAll();
			}
		} else {
			remove();
		}
		isUpdatingQuantity = false;
	}

	function openCart() {
		invalidateAll();
		const cart = document.querySelector('.cartDrawer');
		cart.style.right = '0';
	}
	$: if (isCartUpdatedValue) {
		openCart();
	}
	$: isScrolled = false;
	$: scrolled = isScrolled ? 'scrolled' : '';
	function handleScroll() {
		isScrolled = window.scrollY > 100 ? true : false;
		if (scrolled) {
			const filter = document.querySelector('.filterMainDiv');
			if (filter) {
				filter.style.top = '97px';
			}
		}
	}

	async function applyDiscount() {
		const res = await fetch('/api/discount', {
			method: 'POST',
			body: JSON.stringify({
				cartId,
				code
			})
		});

		const data = await res.json();

		if (data.cartDiscountCodesUpdate?.cart) {
			const discountCodes = data.cartDiscountCodesUpdate?.cart?.discountCodes;
			discountCodes.forEach((discountCode) => {
				if (discountCode?.code == code && discountCode?.applicable) {
					appliedCodes = [...appliedCodes, discountCode.code];
					invalidateAll();
					code = '';
				} else {
					appliedCodes = [];
					code = 'Invalid Code';
					setTimeout(() => {
						code = '';
					}, 1500);
				}
			});
		}
	}

	async function removeDiscount() {
		const res = await fetch('/api/discount', {
			method: 'POST',
			body: JSON.stringify({
				cartId,
				code: ''
			})
		});

		const data = await res.json();

		if (data.cartDiscountCodesUpdate?.cart) {
			appliedCodes = [];
			invalidateAll();
		}
	}
	async function addNote() {
		const res = await fetch('/api/cartNote', {
			method: 'POST',
			body: JSON.stringify({
				cartId,
				note
			})
		});
		const data = await res.json();
		if (data.cartNoteUpdate?.cart) {
			invalidateAll();
			note = 'Note added';
			setTimeout(() => {
				note = '';
			}, 1500);
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();
		document.body.addEventListener('click', (e) => {
			const searchResults = document.querySelector('.searchResultsMain');
			const input = document.querySelector('.input-group input');

			if (
				searchResults &&
				input &&
				!input.contains(e.target) &&
				!searchResults.contains(e.target)
			) {
				searchResults.style.display = 'none';
				query = '';
			}
		});
		///
		const swiperEl = document.querySelector(`.headerSlider`);

		const swiperParams = {
			slidesPerView: 1,
			navigation: false,
			loop: true,
			autoplay: true
		};

		if (swiperEl) {
			Object.assign(swiperEl, swiperParams);
			swiperEl.initialize();
		}
	});
</script>

<div class={`container ${scrolled}`}>
	<div class="customHeaderContainer">
		<div class="desktopHeader">
			<div class="headerInner">
				{#each customHeaderItems as item, i}
					<div class="headerBlock">
						<div class="headerImage">
							<img src={item.image.url} alt={item.text} />
						</div>
						<div class="headerText">{item.text}</div>
					</div>
					{#if i != customHeaderItems.length - 1}
						<svg
							width="1"
							height="20"
							viewBox="0 0 1 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<line
								style="
				  stroke: white;
			  "
								x1="0.5"
								y1="1"
								x2="0.499999"
								y2="19"
								stroke="white"
								stroke-linecap="round"
							></line>
						</svg>
					{/if}
				{/each}
			</div>
		</div>
		<div class="mobileHeader">
			<div class="mobileHeaderSliderDiv">
				<swiper-container init="false" class="headerSlider">
					{#each customHeaderItems as item, i}
						<swiper-slide>
							<div class="headerBlock">
								<div class="headerImage">
									<img src={item.image.url} alt={item.text} />
								</div>
								<div class="headerText">{item.text}</div>
							</div>
						</swiper-slide>
					{/each}
				</swiper-container>
			</div>
		</div>
	</div>
	<div class="main">
		<div class="upper">
			{#if openCustomSearchBar}
				<div class="customSearchBar" transition:fade={{ duration: 300, delay: 200 }}>
					<div class="customCross">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								style="enable-background:new 0 0 512 512;height: 16px;width: 16px;"
								version="1.1"
								viewBox="0 0 512 512"
								width="512px"
								xml:space="preserve"
								on:click={() => {
									openCustomSearchBar = false;
									query = '';
									searchResults = [];
								}}
							>
								<path
									d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
								></path>
							</svg>
						</div>
					</div>
					<div class="containerFluid">
						<div class="row">
							<div class="colLg">
								<form action="/search" method="get" role="search">
									<div class="inputGroup">
										<input
											class="formControl"
											placeholder="Search Products"
											type="search"
											name="q"
											id="sch"
											bind:value={query}
											on:focus={() => {
												const searchResults = document.querySelector('.searchResultsMainMobile');
												searchResults.style.display = 'block';
											}}
											on:input={searchProducts}
										/>

										<!-- SEARCH SVG -->
										<div class="inputGroupAppend">
											<button class="btn" type="submit" aria-label="search">
												<span>
													<svg
														style="width: 18px; height: 18px;"
														width="30"
														height="30"
														viewBox="0 0 30 30"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M19.7437 20.3977H21.0532L28.8153 28.1597C28.9021 28.2466 28.9508 28.3644 28.9508 28.4872C28.9507 28.61 28.9019 28.7277 28.815 28.8145C28.7282 28.9013 28.6104 28.95 28.4876 28.95C28.3648 28.95 28.2471 28.9011 28.1602 28.8143L28.16 28.814L20.0902 20.7442L19.7437 20.3977ZM19.5192 20.1732L19.4361 20.0901L18.7047 20.6565C16.5034 22.3615 13.7353 23.1639 10.9634 22.9003C8.19159 22.6368 5.62422 21.3272 3.78364 19.238C1.94306 17.1488 0.967515 14.4368 1.05547 11.6539C1.14343 8.87088 2.28827 6.22595 4.25711 4.25711C6.22595 2.28827 8.87089 1.14343 11.6539 1.05547C14.4368 0.967515 17.1488 1.94306 19.238 3.78364C21.3272 5.62422 22.6368 8.19159 22.9003 10.9634C23.1639 13.7353 22.3615 16.5034 20.6565 18.7047L19.5192 20.1732Z"
															stroke="#373735"
															stroke-width="2.1"
														></path>
													</svg>
												</span>
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div class="searchResultsMainMobile" transition:fade={{ duration: 300, delay: 200 }}>
						<div class="content">
							<div class="suggestionAndResults">
								<div class="suggestions">
									<div class="popularSearches">
										<p class="popularSearchesLabel">Popular Searches</p>
										<ul class="popularList">
											{#each popularSearches as item}
												<!-- svelte-ignore a11y-click-events-have-key-events -->
												<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
												<li
													class="popularListItem"
													on:click={() => {
														query = item;
														searchProducts();
													}}
												>
													{item}
												</li>
											{/each}
										</ul>
									</div>
									{#if searchResults.length > 0}
										<div class="categories">
											<p class="popularSearchesLabel">categories</p>
											{#if collections.length > 0}
												<ul class="categoryList">
													{#each collections as item}
														<li>
															<a
																href="/collections/{item.handle}"
																data-sveltekit-preload-data="hover"
																on:click={() => {
																	const searchResultsMainMobile = document.querySelector(
																		'.searchResultsMainMobile'
																	);
																	searchResultsMainMobile.style.display = 'none';
																	query = '';
																	searchResults = [];
																	openCustomSearchBar = false;
																}}
																class="categoryListItem">{item.title}</a
															>
														</li>
													{/each}
												</ul>
											{/if}
											{#if collections.length == 0}
												<p class="noResults">No categories found</p>
											{/if}
										</div>
									{/if}
								</div>
								<div class="results">
									<div class="searchHeader">
										<p class="productLabel">Products</p>
									</div>
									<div class="searchResults">
										{#if searchResults.length > 0}
											{#each searchResults as product}
												<div class="searchProductCard">
													<img
														src={`${product.featuredImage.url}&width=300`}
														alt={product.title}
														class="searchProductImage"
													/>
													<a
														href="/products/{product.handle}"
														class="searchProductTitle"
														on:click={() => {
															const searchResultsDiv = document.querySelector('.searchResultsMain');
															searchResultsDiv.style.display = 'none';
															query = '';
															searchResults = [];
															openCustomSearchBar = false;
														}}
														data-sveltekit-reload>{product.title}</a
													>
													<p class="searchProductPrice">
														${product.priceRange.maxVariantPrice.amount}
													</p>
												</div>
											{/each}
										{:else}
											<p class="noResults">Start typing for search results</p>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
			<div class="sidebar">
				<div class="sideBarContent">
					<div class="close">
						<button
							on:click={() => {
								const sidebar = document.querySelector('.sidebar');
								sidebar.style.left = '-100%';
							}}
							aria-label="Close Sidebar"
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
								></path>
							</svg></button
						>
					</div>
					<form class="formInline" action="/search" method="get">
						<div class="inputGroup">
							<input
								class="formControl"
								name="q"
								type="text"
								title="Search"
								placeholder="Search"
								value=""
								autocomplete="off"
							/>

							<div class="inputGroupAppend">
								<button
									class="btn btn-outline-dark bg-transparent border-0 h-auto py-2 px-0"
									type="submit"
									aria-label="Search"
								>
									<svg class="d-block" stroke="currentColor" fill="none" height="20" width="20">
										<title> Search </title>

										<polyline points="13,13 18,18"></polyline>

										<circle cx="8.5" cy="8.5" r="6.5"></circle>
									</svg>
								</button>
							</div>
						</div>
					</form>
					<ul class="mobileNavBarMain">
						{#each menuItems as item, i}
							<li class="mobileNavBarItem">
								<div
									class={`titleAndIcon ${i == menuItems.length - 1 ? 'borderBottomMobileNav' : ''}`}
								>
									<p>{item.title}</p>
									<button
										class="showSubMenu"
										on:click={() => {
											openIndex = i;
										}}
										aria-label="Open Sub Menu"
										style="display: {openIndex === i ? 'none' : 'inline-block'}"
									>
										+
									</button>
									<button
										class="hideSubMenu"
										on:click={() => {
											openIndex = -1;
										}}
										aria-label="Close Sub Menu"
										style="display: {openIndex === i ? 'inline-block' : 'none'}"
									>
										-
									</button>
								</div>
								<div class="subMenu {openIndex === i ? 'active' : ''}">
									<div class="subMenuContent">
										{#each item.columns as column, i}
											<div class="subMenuCol">
												<h6 class="megaSubMenuHeading">
													{column.title && i == 0 ? column.title : ''}
												</h6>
												{#each column.fields as field}
													{#if field.heading}
														<a
															class="megaSubMenuItem link"
															href={field.url}
															on:click={() => {
																const sidebar = document.querySelector('.sidebar');
																sidebar.style.left = '-100%';
															}}>{field.heading}</a
														>
													{:else if field.productImage}
														<a
															class="megaSubMenuItem"
															href="/collections/all"
															on:click={() => {
																const sidebar = document.querySelector('.sidebar');
																sidebar.style.left = '-100%';
															}}
														>
															<img
																class="subMenuImage"
																src={`https:${field.productImage.fields.file.url}`}
																alt={field.productTitle}
																loading="lazy"
															/>
														</a>
														<div>
															<a
																href="/collections/all"
																class="link"
																on:click={() => {
																	const sidebar = document.querySelector('.sidebar');
																	sidebar.style.left = '-100%';
																}}
															>
																{field.productTitle}
															</a>
														</div>
													{:else if field.swatchImage}
														<div class="swatch">
															<img
																src={`https:${field.swatchImage.fields.file.url}`}
																alt={field.productTitle}
																width="40px"
																height="40px"
																class="swatchImage"
																loading="lazy"
															/>
															<a
																href="/collections/all"
																class="link"
																on:click={() => {
																	const sidebar = document.querySelector('.sidebar');
																	sidebar.style.left = '-100%';
																}}
															>
																<p>{field.title}</p>
															</a>
														</div>
													{/if}
												{/each}
											</div>
										{/each}
									</div>
								</div>
							</li>
						{/each}
						<li>
							<a
								href="/account"
								class="mobileNavBarLink"
								on:click={() => {
									const sidebar = document.querySelector('.sidebar');
									sidebar.style.left = '-100%';
								}}>ACCOUNT</a
							>
						</li>
					</ul>
				</div>
			</div>
			<div class="hamBurger">
				<button
					on:click={() => {
						const sidebar = document.querySelector('.sidebar');
						sidebar.style.left = '0';
					}}
					aria-label="Menu"
					><img src="/hamburger.svg" alt="Menu" width="50px" height="50px" /></button
				>
			</div>
			<div class="logo">
				<a href="/"
					><img
						src="/ins.webp"
						alt="Cat"
						height="200px"
						width="200px"
						class="ins"
						transition:fade={{ duration: 300 }}
					/></a
				>
			</div>
			<div class={`cart ${scrolled ? 'marginTop' : ''}`}>
				<div class="input-group">
					<input
						type="text"
						placeholder="Search Products"
						bind:value={query}
						on:focus={() => {
							const searchResults = document.querySelector('.searchResultsMain');
							searchResults.style.display = 'block';
						}}
						on:input={searchProducts}
					/>
					<button aria-label="Search"
						><svg
							style="width: 22px; height: 24px;"
							width="30"
							height="30"
							viewBox="0 0 30 30"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M19.7437 20.3977H21.0532L28.8153 28.1597C28.9021 28.2466 28.9508 28.3644 28.9508 28.4872C28.9507 28.61 28.9019 28.7277 28.815 28.8145C28.7282 28.9013 28.6104 28.95 28.4876 28.95C28.3648 28.95 28.2471 28.9011 28.1602 28.8143L28.16 28.814L20.0902 20.7442L19.7437 20.3977ZM19.5192 20.1732L19.4361 20.0901L18.7047 20.6565C16.5034 22.3615 13.7353 23.1639 10.9634 22.9003C8.19159 22.6368 5.62422 21.3272 3.78364 19.238C1.94306 17.1488 0.967515 14.4368 1.05547 11.6539C1.14343 8.87088 2.28827 6.22595 4.25711 4.25711C6.22595 2.28827 8.87089 1.14343 11.6539 1.05547C14.4368 0.967515 17.1488 1.94306 19.238 3.78364C21.3272 5.62422 22.6368 8.19159 22.9003 10.9634C23.1639 13.7353 22.3615 16.5034 20.6565 18.7047L19.5192 20.1732Z"
								stroke="#373735"
								stroke-width="2.1"
							></path>
						</svg></button
					>
				</div>
				<a href="/account/login" class="signin" aria-label="Sign In">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="24"
						viewBox="0 0 22 24"
						fill="none"
					>
						<path
							d="M1.3978 19.9698C1.56716 16.5045 3.77744 13.4704 7.02388 12.2468C9.58662 11.2808 12.4134 11.2808 14.9761 12.2468C18.2226 13.4704 20.4328 16.5045 20.6022 19.9698L20.765 23.3H1.23505L1.3978 19.9698Z"
							stroke="black"
							stroke-width="1.4"
						></path>
						<circle cx="11" cy="5" r="4.3" stroke="black" stroke-width="1.4"></circle>
					</svg>
				</a>
				<button
					class="cartIcon"
					on:click={() => {
						const cartDrawer = document.querySelector('.cartDrawer');
						cartDrawer.style.right = '0';
					}}
					aria-label="Cart"
				>
					<svg
						style="width: 25px; height: 25px;"
						width="29"
						height="32"
						viewBox="0 0 29 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.21412 12.76C2.27445 12.0082 2.61575 11.3067 3.17003 10.7953C3.72431 10.2838 4.45091 9.99985 5.20512 10H23.2921C24.0463 9.99985 24.7729 10.2838 25.3272 10.7953C25.8815 11.3067 26.2228 12.0082 26.2831 12.76L27.4876 27.76C27.5208 28.1728 27.4681 28.588 27.3329 28.9794C27.1977 29.3708 26.9829 29.73 26.7021 30.0344C26.4213 30.3387 26.0805 30.5817 25.7012 30.7478C25.3219 30.914 24.9122 30.9999 24.4981 31H3.99912C3.585 30.9999 3.17539 30.914 2.79609 30.7478C2.41678 30.5817 2.07598 30.3387 1.79516 30.0344C1.51434 29.73 1.29957 29.3708 1.16437 28.9794C1.02918 28.588 0.976486 28.1728 1.00962 27.76L2.21412 12.76V12.76Z"
							stroke="#373735"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path><path
							d="M20.249 14.5V7C20.249 5.4087 19.6169 3.88258 18.4917 2.75736C17.3665 1.63214 15.8403 1 14.249 1C12.6577 1 11.1316 1.63214 10.0064 2.75736C8.88116 3.88258 8.24902 5.4087 8.24902 7V14.5"
							stroke="#373735"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
					<span class="cartCount">{totalQuantity ? totalQuantity : 0}</span>
				</button>

				<div class="searchResultsMain" transition:fade={{ duration: 300, delay: 200 }}>
					<div class="content">
						<div class="suggestionAndResults">
							<div class="suggestions">
								<div class="popularSearches">
									<p class="popularSearchesLabel">Popular Searches</p>
									<ul class="popularList">
										{#each popularSearches as item}
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
											<li
												class="popularListItem"
												on:click={() => {
													query = item;
													searchProducts();
												}}
											>
												{item}
											</li>
										{/each}
									</ul>
								</div>
								{#if searchResults.length > 0}
									<div class="categories">
										<p class="popularSearchesLabel">categories</p>
										{#if collections.length > 0}
											<ul class="categoryList">
												{#each collections as item}
													<li>
														<a
															href="/collections/{item.handle}"
															data-sveltekit-preload-data="hover"
															on:click={() => {
																const searchResultsMain =
																	document.querySelector('.searchResultsMain');
																searchResultsMain.style.display = 'none';
																query = '';
																searchResults = [];
															}}
															class="categoryListItem">{item.title}</a
														>
													</li>
												{/each}
											</ul>
										{/if}
										{#if collections.length == 0}
											<p class="noResults">No categories found</p>
										{/if}
									</div>
								{/if}
							</div>
							<div class="results">
								<div class="searchHeader">
									<p class="productLabel">Products</p>
								</div>
								<div class="searchResults">
									{#if searchResults.length > 0}
										{#each searchResults as product}
											<div class="searchProductCard">
												<img
													src={`${product.featuredImage.url}&width=300`}
													alt={product.title}
													class="searchProductImage"
												/>
												<a
													href="/products/{product.handle}"
													class="searchProductTitle"
													on:click={() => {
														const searchResultsDiv = document.querySelector('.searchResultsMain');
														searchResultsDiv.style.display = 'none';
														query = '';
														searchResults = [];
													}}
													data-sveltekit-reload>{product.title}</a
												>
												<p class="searchProductPrice">
													${product.priceRange.maxVariantPrice.amount}
												</p>
											</div>
										{/each}
									{:else}
										<p class="noResults">Start typing for search results</p>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="cartDrawer">
				<div class="cartMain">
					<div class="closeCart">
						<h2 class="cartTitle">YOUR CART</h2>
						<button
							class="closeCartButton"
							on:click={() => {
								isCartUpdated.set(false);
								const cartDrawer = document.querySelector('.cartDrawer');
								cartDrawer.style.right = '-200%';
							}}
							aria-label="Close Cart"
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
					</div>
					<div class="shippingDetailsParent">
						<div class="shippingDetails">
							<p class="shippingText">
								<svg
									width="19"
									height="14"
									viewBox="0 0 19 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.83261 13.31C3.15219 13.31 2.57243 13.0739 2.09336 12.6018C1.61428 12.1297 1.37474 11.5464 1.37474 10.8521H0V0H13.31V3.47851H15.4971L18.3299 7.24864V10.8521H16.851C16.851 11.5464 16.6115 12.1297 16.1324 12.6018C15.6533 13.0739 15.0736 13.31 14.3931 13.31C13.7127 13.31 13.1329 13.0739 12.6539 12.6018C12.1748 12.1297 11.9353 11.5464 11.9353 10.8521H6.29049C6.29049 11.5464 6.05095 12.1297 5.57187 12.6018C5.09279 13.0739 4.51304 13.31 3.83261 13.31ZM3.83261 12.0602C4.16588 12.0602 4.45055 11.9422 4.68662 11.7061C4.92269 11.4701 5.04072 11.1854 5.04072 10.8521C5.04072 10.5189 4.92269 10.2342 4.68662 9.99812C4.45055 9.76206 4.16588 9.64402 3.83261 9.64402C3.49934 9.64402 3.21467 9.76206 2.97861 9.99812C2.74254 10.2342 2.62451 10.5189 2.62451 10.8521C2.62451 11.1854 2.74254 11.4701 2.97861 11.7061C3.21467 11.9422 3.49934 12.0602 3.83261 12.0602ZM1.24977 9.60236H1.70801C1.94408 9.22743 2.24263 8.92888 2.60368 8.7067C2.96472 8.48452 3.36742 8.37343 3.81178 8.37343C4.25615 8.37343 4.66232 8.48799 5.03031 8.71711C5.39829 8.94624 5.70032 9.24132 5.93639 9.60236H12.0602V1.24977H1.24977V9.60236ZM14.3931 12.0602C14.7264 12.0602 15.0111 11.9422 15.2471 11.7061C15.4832 11.4701 15.6012 11.1854 15.6012 10.8521C15.6012 10.5189 15.4832 10.2342 15.2471 9.99812C15.0111 9.76206 14.7264 9.64402 14.3931 9.64402C14.0599 9.64402 13.7752 9.76206 13.5391 9.99812C13.3031 10.2342 13.185 10.5189 13.185 10.8521C13.185 11.1854 13.3031 11.4701 13.5391 11.7061C13.7752 11.9422 14.0599 12.0602 14.3931 12.0602ZM13.31 7.81103H17.1843L14.8722 4.72828H13.31V7.81103Z"
										fill="black"
									></path>
								</svg>
								{#if freeShippingDiff > 0}
									You are <span class="shippingTextSpan">${freeShippingDiff}</span> away from free shipping
								{:else}
									Congrats! You've unlocked <span class="shippingTextSpan">FREE SHIPPING</span>
								{/if}
							</p>
							<div class="progressMain">
								<div class="progressContainer">
									<div
										class="progress"
										style={`width: ${progressPercent < 100 ? progressPercent : 100}%`}
									></div>
								</div>
							</div>
						</div>
					</div>
					{#if merchandise?.length > 0}
						{#each lines?.edges as item}
							<div class="cartProductInfo" transition:fade={{ duration: 300, delay: 200 }}>
								<div class="mainProduct">
									<div class="productImage">
										<img src={`${item.node.merchandise.image.url}&width=300`} alt="Product" />
									</div>
									<div class="productText">
										<div class="titleCloseBtn">
											<a
												href={`/products/${item.node.merchandise.product.handle}`}
												data-sveltekit-reload
												><p class="prodTitle">{item.node.merchandise.product.title}</p></a
											>
											<div class="delProduct">
												<button
													style="cursor: pointer;"
													on:click={() => {
														lineIds[0] = item.node.id;
														remove();
													}}
													aria-label="Delete Product"
													><svg
														xmlns="http://www.w3.org/2000/svg"
														x="0px"
														y="0px"
														width="11"
														height="11"
														viewBox="0 0 24 24"
													>
														<path
															d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"
															fill="black"
															stroke="black"
															stroke-width="4"
														></path>
													</svg></button
												>
											</div>
										</div>
										<div class="prodPriceDiv">
											<p class="prodPrice">${item.node.merchandise.price.amount}</p>
										</div>
										{#if item.node.merchandise.selectedOptions}
											{#each item.node.merchandise.selectedOptions as option}
												{#if option.name === 'Color'}
													<p class="prodColor">Color: {option.value}</p>
												{/if}
												{#if option.name === 'Size'}
													<div class="prodSizeDiv">
														<p class="prodSize">
															Size: <span class="sizeValue">{option.value}</span>
														</p>
													</div>
												{/if}
											{/each}
										{/if}
										<div class="quantity">
											<p class="quantityText">Quantity:</p>
											<div class="quant">
												<button
													class="quantityButton"
													on:click={() => {
														id = item.node.id;
														quantity = item.node.quantity;
														lineIds[0] = item.node.id;
														handleDecrement();
													}}
													aria-label="Decrement Quantity">-</button
												>
												<p class="quantityValue">{item.node.quantity}</p>
												<button
													class="quantityButton"
													disabled={isUpdatingQuantity}
													on:click={() => {
														id = item.node.id;
														quantity = item.node.quantity;
														handleIncrement();
													}}
													aria-label="Increment Quantity">+</button
												>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/each}
						{#if cart?.note != ''}
							<div class="noteDiv">
								<p>Note : {cart?.note}</p>
							</div>
						{/if}

						<div class="cartTotalDiv">
							<div class="noteMain">
								<div class="note">
									<input type="text" placeholder="Enter Note" bind:value={note} />
									<button
										on:click={addNote}
										class="addNote"
										aria-label="Add Note"
										disabled={note == '' ? true : false}>Add Note</button
									>
								</div>
							</div>
							<div class="discount">
								<input type="text" placeholder="Enter Discount Code" bind:value={code} />
								<button
									on:click={applyDiscount}
									class="applyDiscount"
									disabled={code == '' ? true : false}
									aria-label="Apply Discount">Apply</button
								>
							</div>
							<div class="appliedCodes">
								{#if appliedCodes.length > 0}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									{#each appliedCodes as appliedCode}
										<div class="appliedCode">
											<img src="/tag.svg" alt="Tag" width="20px" height="20px" class="tag" />
											<p>{appliedCode}</p>
											<!-- svelte-ignore missing-declaration -->
											<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
											<img src="/cross.svg" alt="Cross" on:click={removeDiscount} class="cross" />
										</div>
									{/each}
								{/if}
							</div>
							<div class="cartTotal">
								<div class="cartTotalPrice">
									<span class="subTotal">Delivery</span>
									<span>{freeShippingDiff > 0 ? '$8' : 'FREE'}</span>
								</div>
								<div class="cartTotalPrice">
									<span class="subTotal">Subtotal</span>
									<div>
										{#if discountedAmount > 0}
											<span class="prevAmount">${cart?.cost?.subtotalAmount.amount}</span>
										{/if}
										<span class="subTotal"
											>${discountedAmount > 0
												? (cart?.cost?.subtotalAmount.amount - discountedAmount).toFixed(1)
												: cart?.cost?.subtotalAmount.amount}</span
										>
									</div>
								</div>
								<div class="cartButtons">
									<button class="shopButton" aria-label="Continue Shopping"
										><svg
											width="92"
											height="22"
											viewBox="0 0 92 22"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M23.5691 6.94329C22.8313 5.39606 21.4325 4.39662 19.3245 4.39662C18.6775 4.40789 18.0417 4.56759 17.4662 4.8633C16.8908 5.15906 16.3909 5.58299 16.0052 6.1024L15.9283 6.19608V0.132139C15.9283 0.0970937 15.9144 0.0634858 15.8896 0.0387054C15.8648 0.0139244 15.8312 0 15.7961 0H12.8157C12.7811 0.000629708 12.7481 0.0148281 12.7238 0.0395409C12.6995 0.0642537 12.6859 0.0975061 12.6859 0.132139V17.5264C12.6859 17.5608 12.6996 17.5938 12.724 17.6181C12.7483 17.6424 12.7813 17.6561 12.8157 17.6561H16.0076C16.0423 17.6561 16.0756 17.6426 16.1003 17.6182C16.125 17.594 16.1392 17.561 16.1398 17.5264V10.1098C16.1398 8.6683 17.1012 7.64721 18.6395 7.64721C20.322 7.64721 20.7474 9.03108 20.7474 10.4413V17.5264C20.7474 17.5608 20.7611 17.5938 20.7854 17.6181C20.8098 17.6424 20.8428 17.6561 20.8772 17.6561H24.0618C24.0966 17.6561 24.1298 17.6426 24.1545 17.6182C24.1793 17.594 24.1935 17.561 24.1942 17.5264V10.0185C24.1942 9.76144 24.1942 9.50916 24.1605 9.26412C24.1057 8.46108 23.9054 7.67465 23.5691 6.94329Z"
												fill="white"
											></path>
											<path
												d="M7.63135 9.52132C7.63135 9.52132 6.00655 9.13931 5.40807 8.98555C4.80957 8.8318 3.76403 8.50504 3.76403 7.71461C3.76403 6.92418 4.60767 6.6719 5.46336 6.6719C6.31902 6.6719 7.27083 6.87853 7.34534 7.82753C7.34834 7.86175 7.36409 7.89353 7.38945 7.9167C7.41483 7.93984 7.44797 7.95258 7.48233 7.95247L10.6286 7.94046C10.6471 7.9405 10.6654 7.93673 10.6824 7.92938C10.6994 7.92203 10.7147 7.91125 10.7273 7.8977C10.7399 7.8842 10.7497 7.8682 10.7558 7.85075C10.762 7.83329 10.7645 7.81475 10.7632 7.79628C10.5685 4.75952 7.90294 3.67358 5.44411 3.67358C2.5286 3.67358 0.396668 5.5956 0.396668 7.71461C0.396668 9.26184 0.834114 10.713 4.27358 11.722C4.87687 11.8974 5.6965 12.1256 6.41276 12.3251C7.27322 12.5653 7.7371 12.9281 7.7371 13.4999C7.7371 14.163 6.77569 14.6243 5.8311 14.6243C4.46348 14.6243 3.49244 14.1173 3.41312 13.2068C3.40899 13.1735 3.39277 13.1428 3.36749 13.1206C3.34224 13.0985 3.30972 13.0864 3.27611 13.0866L0.137085 13.1011C0.118681 13.1011 0.100467 13.1047 0.0835242 13.1119C0.0665812 13.1191 0.0512592 13.1296 0.0384723 13.1429C0.0256856 13.1561 0.0156945 13.1718 0.00909916 13.1889C0.00250384 13.2061 -0.000561336 13.2244 8.43907e-05 13.2428C0.144297 16.109 2.91318 17.6538 5.49462 17.6538C9.34029 17.6538 11.078 15.4916 11.078 13.4663C11.0829 12.5148 10.8641 10.3478 7.63135 9.52132Z"
												fill="white"
											></path>
											<path
												d="M48.107 4.3918C46.5089 4.3918 45.1699 5.27591 44.307 6.34267V4.51673C44.307 4.48273 44.2936 4.45008 44.2697 4.42584C44.2463 4.40157 44.2137 4.38762 44.1796 4.38702H41.1945C41.1602 4.38702 41.127 4.40066 41.1027 4.42498C41.0784 4.44933 41.0645 4.48235 41.0645 4.51673V21.5746C41.0654 21.6085 41.0794 21.6411 41.1037 21.6647C41.128 21.6886 41.1606 21.702 41.1945 21.702H44.3888C44.4225 21.702 44.4549 21.6886 44.4788 21.6647C44.5026 21.6409 44.5161 21.6083 44.5161 21.5746V15.9671H44.5642C45.0712 16.7407 46.4581 17.6681 48.2706 17.6681C51.6785 17.6681 54.5197 14.8428 54.5197 11.0252C54.5223 7.36134 51.6956 4.3918 48.107 4.3918ZM47.8114 14.4175C47.1388 14.4342 46.4758 14.2502 45.9083 13.8888C45.3408 13.5275 44.8935 13.0053 44.6239 12.3888C44.3545 11.7723 44.2748 11.0896 44.3954 10.4277C44.5156 9.76577 44.8308 9.15477 45.3001 8.67264C45.7696 8.19045 46.372 7.85903 47.0308 7.72066C47.6893 7.58228 48.3742 7.64318 48.998 7.89563C49.622 8.14806 50.1563 8.5806 50.5332 9.13801C50.91 9.69544 51.1121 10.3524 51.114 11.0252C51.1208 11.4649 51.0407 11.9017 50.8785 12.3105C50.7163 12.7193 50.4746 13.092 50.1678 13.4072C49.8611 13.7224 49.495 13.9739 49.0903 14.1473C48.686 14.3207 48.2515 14.4125 47.8114 14.4175Z"
												fill="white"
											></path>
											<path
												d="M31.6116 3.64246C28.6336 3.64246 27.1482 4.65392 25.9558 5.46358L25.9198 5.48759C25.8584 5.52964 25.8152 5.59338 25.7985 5.66597C25.7821 5.73859 25.7936 5.81473 25.8309 5.87921L27.0086 7.9069C27.0308 7.94486 27.061 7.97747 27.097 8.00238C27.1333 8.0273 27.1744 8.04394 27.2179 8.05107C27.2603 8.05872 27.3038 8.05687 27.3453 8.04564C27.3869 8.03441 27.4254 8.01416 27.4583 7.98619L27.5518 7.90933C28.1647 7.39518 29.1478 6.70805 31.5274 6.52065C32.8517 6.41497 33.9959 6.76092 34.8394 7.54894C35.7672 8.40426 36.3226 9.78569 36.3226 11.244C36.3226 13.9277 34.7409 15.6142 32.2004 15.6478C30.1068 15.6358 28.7007 14.5451 28.7007 12.933C28.7007 12.0777 29.0877 11.5203 29.8425 10.9629C29.9001 10.9217 29.9408 10.8611 29.9572 10.7922C29.9736 10.7233 29.9644 10.6508 29.9314 10.5881L28.8737 8.58922C28.8543 8.55346 28.8279 8.52189 28.7962 8.49633C28.7644 8.47076 28.728 8.45172 28.6888 8.44028C28.6487 8.42837 28.6067 8.42501 28.5654 8.43035C28.5238 8.43574 28.484 8.44976 28.4484 8.47153C27.2611 9.17545 25.8045 10.4632 25.8838 12.9378C25.9799 16.0875 28.5999 18.4924 32.0056 18.5909H32.1763H32.4095C36.4569 18.4588 39.3797 15.4556 39.3797 11.3834C39.3797 7.64504 36.654 3.64246 31.6116 3.64246Z"
												fill="white"
											></path>
											<path
												d="M67.1071 5.56439H65.0783C65.031 5.56501 64.9854 5.5842 64.9517 5.61784C64.9178 5.6515 64.8987 5.69698 64.8984 5.74459V9.99942C64.8987 10.0468 64.918 10.092 64.9519 10.1253C64.9856 10.1585 65.031 10.1772 65.0783 10.1772H67.1071C68.3425 10.1772 69.2536 9.2042 69.2536 7.8708C69.2536 6.5374 68.3425 5.56439 67.1071 5.56439Z"
												fill="white"
											></path>
											<path
												d="M73.3396 13.0914C73.3396 13.7088 73.8611 14.0524 74.7696 14.0524C76.005 14.0524 76.7355 13.3845 76.7355 12.2V11.8589L74.8851 11.955C73.909 12.003 73.3396 12.4091 73.3396 13.0914Z"
												fill="white"
											></path>
											<path
												d="M88.3616 0.0385344H61.1053C60.6584 0.038534 60.2154 0.126609 59.8026 0.297724C59.3893 0.468838 59.0141 0.719641 58.6982 1.0358C58.382 1.35195 58.1314 1.72727 57.9604 2.1403C57.7893 2.55332 57.7017 2.99596 57.7021 3.44291V18.3577C57.7021 19.2602 58.0606 20.1258 58.6989 20.7641C59.3371 21.4025 60.2028 21.7614 61.1053 21.7621H88.3616C88.8093 21.7634 89.253 21.6765 89.6671 21.5063C90.0809 21.336 90.4573 21.0858 90.7746 20.7701C91.0915 20.4544 91.3436 20.0792 91.5158 19.6661C91.6878 19.253 91.7765 18.81 91.7773 18.3625V3.44771C91.7779 2.99934 91.6904 2.5552 91.519 2.14083C91.3477 1.72647 91.096 1.35006 90.7787 1.03323C90.4613 0.716408 90.0844 0.465428 89.6696 0.294722C89.2549 0.124015 88.8104 0.03695 88.3616 0.0385344ZM67.2103 11.8517H65.0664C65.0187 11.8517 64.9731 11.8707 64.939 11.9045C64.9053 11.9383 64.8861 11.9841 64.8861 12.0319V15.0831C64.8861 15.1309 64.8672 15.1767 64.8335 15.2105C64.7996 15.2443 64.7538 15.2633 64.706 15.2633H63.1964C63.149 15.2627 63.1032 15.2435 63.0696 15.2098C63.0359 15.1762 63.0171 15.1307 63.0163 15.0831V4.07716C63.0163 4.0294 63.0352 3.98356 63.0693 3.94975C63.103 3.91597 63.1486 3.89699 63.1964 3.89699H67.2103C69.4842 3.89699 71.1113 5.55232 71.1113 7.87556C71.1113 10.1988 69.4961 11.8565 67.2227 11.8565L67.2103 11.8517ZM78.5071 15.0807C78.5075 15.1046 78.5033 15.1282 78.4941 15.1504C78.4852 15.1725 78.4719 15.1927 78.4553 15.2097C78.4383 15.2267 78.4184 15.2402 78.3963 15.2494C78.3745 15.2585 78.3507 15.2633 78.3268 15.2633H76.9015C76.8777 15.2633 76.854 15.2585 76.8321 15.2494C76.8099 15.2402 76.7899 15.2267 76.7732 15.2097C76.7566 15.1927 76.7432 15.1725 76.7344 15.1504C76.7255 15.1282 76.721 15.1046 76.7214 15.0807V14.7516C76.7236 14.7227 76.7168 14.6938 76.7012 14.6693C76.6861 14.6447 76.6633 14.6257 76.636 14.6151C76.6091 14.6046 76.5795 14.6031 76.5516 14.6108C76.5233 14.6185 76.4987 14.635 76.4811 14.6579C76.0555 15.1216 75.3633 15.4579 74.26 15.4579C72.6355 15.4579 71.5608 14.6122 71.5608 13.1515C71.5452 12.7953 71.6187 12.4409 71.7749 12.1203C71.9309 11.7998 72.1649 11.5233 72.4552 11.316C73.0414 10.8763 73.9499 10.6481 75.2983 10.5952L76.7283 10.5472V10.1291C76.7283 9.28581 76.1612 8.92786 75.2501 8.92786C74.3393 8.92786 73.7647 9.24979 73.6305 9.77595C73.6196 9.8131 73.5968 9.84561 73.5653 9.86825C73.5342 9.89092 73.496 9.90238 73.4572 9.90087H72.0464C72.0204 9.90153 71.9946 9.89646 71.9708 9.8861C71.9473 9.87571 71.9258 9.86024 71.9085 9.84077C71.8915 9.82128 71.8787 9.79834 71.8715 9.77342C71.864 9.74851 71.8621 9.72233 71.8661 9.69667C72.0778 8.44735 73.1111 7.49834 75.3153 7.49834C77.6564 7.49834 78.4999 8.5867 78.4999 10.6649L78.5071 15.0807ZM87.386 7.9404L84.2134 16.3997C83.4922 18.3649 82.2302 18.8695 80.8481 18.8695C80.5879 18.8758 80.3279 18.8443 80.0767 18.7758C80.0375 18.7653 80.0031 18.7422 79.978 18.71C79.9535 18.6779 79.9401 18.6385 79.9396 18.598V17.3126C79.9396 17.2858 79.9454 17.2592 79.9567 17.2348C79.9682 17.2104 79.9846 17.1889 80.0053 17.1717C80.0262 17.1544 80.0502 17.142 80.0762 17.1352C80.1022 17.1285 80.1295 17.1275 80.1559 17.1324C80.374 17.1738 80.5952 17.1947 80.817 17.1949C81.1991 17.2141 81.5768 17.1045 81.8894 16.8836C82.2016 16.6628 82.4309 16.3434 82.5402 15.9769L82.6342 15.6813C82.6487 15.6418 82.6487 15.5984 82.6342 15.5588L79.6679 7.94283C79.659 7.91561 79.6564 7.88659 79.6607 7.85822C79.6651 7.82982 79.676 7.80283 79.6922 7.77944C79.7091 7.75605 79.731 7.7369 79.7564 7.72353C79.7817 7.71017 79.8101 7.70297 79.8386 7.70257H81.281C81.3178 7.70293 81.3536 7.7143 81.3841 7.73531C81.4146 7.75627 81.438 7.78588 81.4514 7.8203L83.4658 13.1923C83.4792 13.2274 83.5026 13.2577 83.5335 13.279C83.5647 13.3003 83.6011 13.3117 83.6388 13.3117C83.6761 13.3117 83.7132 13.3003 83.7439 13.279C83.7748 13.2577 83.7987 13.2274 83.8117 13.1923L85.5594 7.83472C85.5709 7.79819 85.5941 7.76636 85.6252 7.74389C85.6563 7.7214 85.6936 7.70945 85.732 7.70979H87.2106C87.2389 7.70966 87.267 7.71631 87.2928 7.72904C87.3182 7.74183 87.3406 7.7604 87.3576 7.7833C87.3747 7.8062 87.386 7.83276 87.3909 7.8609C87.396 7.889 87.3943 7.91789 87.386 7.94522V7.9404Z"
												fill="white"
											></path>
										</svg></button
									>
									<a href={checkoutUrl} target="_blank" class="checkout">CHECKOUT</a>
								</div>
								<div class="cartBanner">
									<div class="bannerMainDiv">
										<p class="bannerText">free exchange within 30 days</p>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<div class="emptyCart">
							<svg
								width="22"
								height="24"
								viewBox="0 0 22 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.756513 23.3L2.02271 7.00769H19.9773L21.2435 23.3H0.756513Z"
									stroke="black"
									stroke-width="1.4"
								></path>
								<path
									d="M5.5 6.30771C5.5 -0.769242 16.5 -0.769231 16.5 6.30771"
									stroke="black"
									stroke-width="1.4"
								></path>
							</svg>
							<h2 class="emptyCartHeading">Your cart is empty!</h2>
							<p class="emptyCartText">Not sure where to start?</p>
							<a
								href="/collections/all"
								class="shopBtn"
								on:click={() => {
									isCartUpdated.set(false);
									const cartDrawer = document.querySelector('.cartDrawer');
									cartDrawer.style.right = '-100%';
								}}>SHOP BEST SELLERS</a
							>
							<a
								href="/collections/new-arrivals"
								class="shopBtn"
								on:click={() => {
									isCartUpdated.set(false);
									const cartDrawer = document.querySelector('.cartDrawer');
									cartDrawer.style.right = '-100%';
								}}>SHOP NEW ARRIVALS</a
							>
						</div>
					{/if}
				</div>
			</div>
			<div class="mobileMenu">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="searchIcon" on:click={() => (openCustomSearchBar = true)}>
					<svg
						class="mblSearchIcon"
						style="width: 20px; height: 20px;"
						width="30"
						height="30"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19.7437 20.3977H21.0532L28.8153 28.1597C28.9021 28.2466 28.9508 28.3644 28.9508 28.4872C28.9507 28.61 28.9019 28.7277 28.815 28.8145C28.7282 28.9013 28.6104 28.95 28.4876 28.95C28.3648 28.95 28.2471 28.9011 28.1602 28.8143L28.16 28.814L20.0902 20.7442L19.7437 20.3977ZM19.5192 20.1732L19.4361 20.0901L18.7047 20.6565C16.5034 22.3615 13.7353 23.1639 10.9634 22.9003C8.19159 22.6368 5.62422 21.3272 3.78364 19.238C1.94306 17.1488 0.967515 14.4368 1.05547 11.6539C1.14343 8.87088 2.28827 6.22595 4.25711 4.25711C6.22595 2.28827 8.87089 1.14343 11.6539 1.05547C14.4368 0.967515 17.1488 1.94306 19.238 3.78364C21.3272 5.62422 22.6368 8.19159 22.9003 10.9634C23.1639 13.7353 22.3615 16.5034 20.6565 18.7047L19.5192 20.1732Z"
							stroke="#373735"
							stroke-width="2.1"
						></path>
					</svg>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="cartIcon"
					on:click={() => {
						const cartDrawer = document.querySelector('.cartDrawer');
						cartDrawer.style.right = '0';
					}}
				>
					<svg
						class="d-block"
						xmlns="http://www.w3.org/2000/svg"
						stroke="currentColor"
						fill="none"
						width="20"
						height="20"
					>
						<title> Cart </title>

						<circle cx="10" cy="10" r="7.5"></circle>

						<polyline points="2.5,7.5 0.5,7.5 0.5,19.5 19.5,19.5 19.5,7.5 17.5,7.5"></polyline>
					</svg>
					<span class="cartCountMobile">{totalQuantity ? totalQuantity : 0}</span>
				</div>
			</div>
		</div>
		<div class="navbar">
			<ul class="navbar-nav">
				{#each menuItems as item}
					<li class="megaMenu" data-sveltekit-preload-data="hover">
						<a class="menuLink" href={`/collections/${item.collectionUrl}`}>{item.title}</a>
						<div class="megaMenuDropDown">
							<div class="megaMenuDropDownContainer">
								{#each item.columns as column, i}
									<div class="megaMenuCol">
										<div class="megaSubMenu">
											<h6 class="megaSubMenuHeading">
												{column.title && i == 0 ? column.title : ''}
											</h6>
											{#each column.fields as field}
												{#if field.heading}
													<a class="megaSubMenuItem link" href={field.url}>{field.heading}</a>
												{:else if field.productImage}
													<a class="megaSubMenuItem" href="/collections/all">
														<img
															class="subMenuImage"
															src={`https:${field.productImage.fields.file.url}`}
															alt={field.productTitle}
															loading="lazy"
														/>
													</a>
													<div>
														<a href="/collections/all" class="link">{field.productTitle}</a>
													</div>
												{:else if field.swatchImage}
													<div class="swatch">
														<img
															src={`https:${field.swatchImage.fields.file.url}`}
															alt={field.productTitle}
															width="40px"
															height="40px"
															class="swatchImage"
															loading="lazy"
														/>
														<a href="/collections/all" class="link">
															<p>{field.title}</p>
														</a>
													</div>
												{/if}
											{/each}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</li>
				{/each}
			</ul>
			<div></div>
		</div>
	</div>
</div>
<slot />
<footer>
	<div class="footerDiv">
		<div class="footerMainDivDesktop">
			<div class="row-1">
				<div class="mailing">
					<p class="heading">JOIN OUR MAILING LIST</p>
					<p class="signup-text">Sign up for our email list to unlock 15% off your first order.</p>
					<form>
						<input type="email" name="email" />
						<button type="submit" aria-label="Subscribe">JOIN</button>
					</form>
				</div>
				<div class="column">
					<p class="heading">SUPPORT</p>
					<p>Contact Us</p>
					<p>Order Tracking</p>
					<p>FAQ</p>
					<p>Fit Guide</p>
					<p>Info Guide</p>
					<p>Returns</p>
					<p>Shipping Policy</p>
					<p>Privacy Policy</p>
				</div>
				<div class="column">
					<p class="heading">COMPANY</p>
					<p>Our Story</p>
					<p>Sustainability</p>
					<p>PF Mag</p>
					<p>Reviews</p>
					<p>Press & Affiliates</p>
					<p class="hiring">Careers - We're Hiring!</p>
				</div>
				<div class="column">
					<p class="heading">SHOP</p>
					<p class="dream">Dream Team Reward Program</p>
					<p>Download Our App</p>
					<p>Our Store</p>
					<p>Frontline Discounts</p>
					<p>Gift Cards</p>
					<p>Accessibility</p>
				</div>
			</div>
			<div class="row-2">
				<p class="follow">FOLLOW US @intangible</p>
				<div class="icons">
					<a
						href="https://www.linkedin.com/company/intangible-solutions"
						target="_blank"
						rel="nofollow"
						aria-label="LinkedIn"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							version="1.1"
							id="Capa_1"
							x="0px"
							y="0px"
							width="25px"
							height="25px"
							viewBox="0 0 438.536 438.536"
							style="enable-background:new 0 0 438.536 438.536;"
							xml:space="preserve"
						>
							<g>
								<path
									d="M421.981,16.562C410.941,5.519,397.711,0,382.298,0H56.248C40.83,0,27.604,5.521,16.561,16.562   C5.52,27.6,0.001,40.828,0.001,56.243V382.29c0,15.413,5.518,28.644,16.56,39.683c11.043,11.04,24.272,16.563,39.687,16.563   h326.046c15.41,0,28.644-5.523,39.684-16.563c11.043-11.039,16.557-24.27,16.557-39.683V56.243   C438.534,40.825,433.021,27.604,421.981,16.562z M157.462,158.025c17.224-16.652,37.924-24.982,62.097-24.982   c24.36,0,45.153,8.33,62.381,24.982c17.228,16.655,25.837,36.785,25.837,60.386c0,23.598-8.609,43.729-25.837,60.379   c-17.228,16.659-38.014,24.988-62.381,24.988c-24.172,0-44.87-8.336-62.097-24.988c-17.228-16.652-25.841-36.781-25.841-60.379   C131.621,194.81,140.234,174.681,157.462,158.025z M388.865,370.589c0,4.945-1.718,9.083-5.141,12.416   c-3.433,3.33-7.519,4.996-12.282,4.996h-305.2c-4.948,0-9.091-1.666-12.419-4.996c-3.333-3.326-4.998-7.471-4.998-12.416V185.575   H89.08c-3.805,11.993-5.708,24.462-5.708,37.402c0,36.553,13.322,67.715,39.969,93.511c26.65,25.786,58.721,38.685,96.217,38.685   c24.744,0,47.583-5.903,68.527-17.703c20.937-11.807,37.486-27.839,49.676-48.112c12.183-20.272,18.274-42.4,18.274-66.38   c0-12.94-1.91-25.406-5.715-37.402h38.547v185.014H388.865z M388.865,115.626c0,5.52-1.903,10.184-5.716,13.99   c-3.805,3.809-8.466,5.711-13.989,5.711h-49.676c-5.517,0-10.185-1.903-13.99-5.711c-3.806-3.806-5.708-8.47-5.708-13.99V68.522   c0-5.33,1.902-9.945,5.708-13.848c3.806-3.901,8.474-5.854,13.99-5.854h49.676c5.523,0,10.185,1.952,13.989,5.854   c3.812,3.903,5.716,8.518,5.716,13.848V115.626z"
								></path>
							</g>
						</svg>
					</a>
					<a
						href="https://www.linkedin.com/company/intangible-solutions"
						target="_blank"
						rel="nofollow"
						aria-label="facebook"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							id="Bold"
							enable-background="new 0 0 24 24"
							height="25px"
							viewBox="0 0 24 24"
							width="25px"
						>
							<path
								d="m15.997 3.985h2.191v-3.816c-.378-.052-1.678-.169-3.192-.169-3.159 0-5.323 1.987-5.323 5.639v3.361h-3.486v4.266h3.486v10.734h4.274v-10.733h3.345l.531-4.266h-3.877v-2.939c.001-1.233.333-2.077 2.051-2.077z"
							></path>
						</svg>
					</a>
					<a
						href="https://www.linkedin.com/company/intangible-solutions"
						target="_blank"
						rel="nofollow"
						aria-label="pinterest"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							version="1.1"
							id="Capa_1"
							x="0px"
							y="0px"
							width="25px"
							height="25px"
							viewBox="0 0 480.666 480.666"
							style="enable-background:new 0 0 480.666 480.666;"
							xml:space="preserve"
						>
							<g id="pinterest_2_">
								<g>
									<path
										d="M240.35,0.008C107.612,0.008,0,107.605,0,240.31c0,98.431,59.168,182.967,143.867,220.133    c-0.717-16.795-0.157-36.918,4.145-55.17c4.646-19.522,30.957-130.976,30.957-130.976s-7.669-15.345-7.669-38.009    c0-35.623,20.637-62.215,46.323-62.215c21.885,0,32.421,16.429,32.421,36.076c0,21.962-13.996,54.85-21.198,85.283    c-6.016,25.5,12.781,46.301,37.907,46.301c45.545,0,76.221-58.506,76.221-127.781c0-52.66-35.478-92.087-100.006-92.087    c-72.916,0-118.305,54.359-118.305,115.077c0,20.949,6.142,35.702,15.837,47.127c4.428,5.268,5.051,7.388,3.43,13.405    c-1.154,4.427-3.773,15.072-4.895,19.28c-1.592,6.096-6.516,8.262-12.033,6.033c-33.573-13.733-49.192-50.471-49.192-91.814    c0-68.279,57.578-150.125,171.736-150.125c91.773,0,152.189,66.377,152.189,137.654c0,94.277-52.434,164.723-129.713,164.723    c-25.937,0-50.346-14.045-58.701-29.975c0,0-13.965,55.389-16.894,66.065c-5.113,18.517-15.089,37.058-24.193,51.491    c21.605,6.375,44.454,9.85,68.116,9.85c132.736,0,240.316-107.595,240.316-240.348C480.666,107.605,373.086,0.008,240.35,0.008z"
									></path>
								</g>
							</g>
						</svg>
					</a>
					<a
						href="https://www.linkedin.com/company/intangible-solutions"
						target="_blank"
						rel="nofollow"
						aria-label="tiktok"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							id="Capa_1"
							enable-background="new 0 0 512 512"
							height="25px"
							viewBox="0 0 512 512"
							width="25px"
						>
							<g
								><path
									d="m480.32 128.39c-29.22 0-56.18-9.68-77.83-26.01-24.83-18.72-42.67-46.18-48.97-77.83-1.56-7.82-2.4-15.89-2.48-24.16h-83.47v228.08l-.1 124.93c0 33.4-21.75 61.72-51.9 71.68-8.75 2.89-18.2 4.26-28.04 3.72-12.56-.69-24.33-4.48-34.56-10.6-21.77-13.02-36.53-36.64-36.93-63.66-.63-42.23 33.51-76.66 75.71-76.66 8.33 0 16.33 1.36 23.82 3.83v-62.34-22.41c-7.9-1.17-15.94-1.78-24.07-1.78-46.19 0-89.39 19.2-120.27 53.79-23.34 26.14-37.34 59.49-39.5 94.46-2.83 45.94 13.98 89.61 46.58 121.83 4.79 4.73 9.82 9.12 15.08 13.17 27.95 21.51 62.12 33.17 98.11 33.17 8.13 0 16.17-.6 24.07-1.77 33.62-4.98 64.64-20.37 89.12-44.57 30.08-29.73 46.7-69.2 46.88-111.21l-.43-186.56c14.35 11.07 30.04 20.23 46.88 27.34 26.19 11.05 53.96 16.65 82.54 16.64v-60.61-22.49c.02.02-.22.02-.24.02z"
								></path></g
							>
						</svg>
					</a>
				</div>
			</div>
			<div class="row-3">
				<div class="logo-copy">
					<img src="/ins.webp" alt="INS" height="200px" width="200px" />
					<p>© 2024 Intangible Solutions</p>
				</div>
			</div>
		</div>
		<div class="footerMainDivMobile">
			<div class="footerContainer">
				<div class="mailingDiv">
					<div class="mailingContent">
						<p class="headingMobile">JOIN OUR MAILING LIST</p>
						<p class="signupTextMobile">
							Sign up for our email list to unlock 15% off your first order.
						</p>
						<div class="formGroup">
							<div class="inputGroupMobile">
								<input type="email" title="Email" class="formControlMobile" />
								<div class="inputGroupAppend">
									<button type="submit" class="btnSubmitMobile" aria-label="Join">JOIN</button>
								</div>
							</div>
						</div>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="footerMenuMobile"
						class:activeFo={isActive1}
						on:click={() => (isActive1 = !isActive1)}
					>
						<div class="footerMenuColCenter">
							<button class="footerMenuHeader" aria-label="Support"> SUPPORT </button>
							<div class="footerMenuContent">
								<p>Contact Us</p>
								<p>Order Tracking</p>
								<p>FAQ</p>
								<p>Fit Guide</p>
								<p>Info Guide</p>
								<p>Returns</p>
								<p>Shipping Policy</p>
								<p>Privacy Policy</p>
							</div>
						</div>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="footerMenuMobile"
						class:activeFo={isActive2}
						on:click={() => (isActive2 = !isActive2)}
					>
						<div class="footerMenuColCenter">
							<button class="footerMenuHeader" aria-label="Company"> COMPANY </button>
							<div class="footerMenuContent">
								<p>Our Story</p>
								<p>Sustainability</p>
								<p>PF Mag</p>
								<p>Reviews</p>
								<p>Press & Affiliates</p>
								<p>Careers - We're Hiring!</p>
							</div>
						</div>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="footerMenuMobile borderBottom"
						class:activeFo={isActive3}
						on:click={() => (isActive3 = !isActive3)}
					>
						<div class="footerMenuColCenter">
							<button class="footerMenuHeader" aria-label="Shop"> SHOP </button>
							<div class="footerMenuContent">
								<p>Dream Team Reward Program</p>
								<p>Download Our App</p>
								<p>Our Store</p>
								<p>Frontline Discounts</p>
								<p>Gift Cards</p>
								<p>Accessibility</p>
							</div>
						</div>
					</div>
					<div class="row-2">
						<p class="follow">FOLLOW US @intangible</p>
						<div class="icons">
							<a
								href="https://www.linkedin.com/company/intangible-solutions"
								target="_blank"
								rel="nofollow"
								aria-label="LinkedIn"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									version="1.1"
									id="Capa_1"
									x="0px"
									y="0px"
									width="25px"
									height="25px"
									viewBox="0 0 438.536 438.536"
									style="enable-background:new 0 0 438.536 438.536;"
									xml:space="preserve"
								>
									<g>
										<path
											d="M421.981,16.562C410.941,5.519,397.711,0,382.298,0H56.248C40.83,0,27.604,5.521,16.561,16.562   C5.52,27.6,0.001,40.828,0.001,56.243V382.29c0,15.413,5.518,28.644,16.56,39.683c11.043,11.04,24.272,16.563,39.687,16.563   h326.046c15.41,0,28.644-5.523,39.684-16.563c11.043-11.039,16.557-24.27,16.557-39.683V56.243   C438.534,40.825,433.021,27.604,421.981,16.562z M157.462,158.025c17.224-16.652,37.924-24.982,62.097-24.982   c24.36,0,45.153,8.33,62.381,24.982c17.228,16.655,25.837,36.785,25.837,60.386c0,23.598-8.609,43.729-25.837,60.379   c-17.228,16.659-38.014,24.988-62.381,24.988c-24.172,0-44.87-8.336-62.097-24.988c-17.228-16.652-25.841-36.781-25.841-60.379   C131.621,194.81,140.234,174.681,157.462,158.025z M388.865,370.589c0,4.945-1.718,9.083-5.141,12.416   c-3.433,3.33-7.519,4.996-12.282,4.996h-305.2c-4.948,0-9.091-1.666-12.419-4.996c-3.333-3.326-4.998-7.471-4.998-12.416V185.575   H89.08c-3.805,11.993-5.708,24.462-5.708,37.402c0,36.553,13.322,67.715,39.969,93.511c26.65,25.786,58.721,38.685,96.217,38.685   c24.744,0,47.583-5.903,68.527-17.703c20.937-11.807,37.486-27.839,49.676-48.112c12.183-20.272,18.274-42.4,18.274-66.38   c0-12.94-1.91-25.406-5.715-37.402h38.547v185.014H388.865z M388.865,115.626c0,5.52-1.903,10.184-5.716,13.99   c-3.805,3.809-8.466,5.711-13.989,5.711h-49.676c-5.517,0-10.185-1.903-13.99-5.711c-3.806-3.806-5.708-8.47-5.708-13.99V68.522   c0-5.33,1.902-9.945,5.708-13.848c3.806-3.901,8.474-5.854,13.99-5.854h49.676c5.523,0,10.185,1.952,13.989,5.854   c3.812,3.903,5.716,8.518,5.716,13.848V115.626z"
										></path>
									</g>
								</svg>
							</a>
							<a
								href="https://www.linkedin.com/company/intangible-solutions"
								target="_blank"
								rel="nofollow"
								aria-label="facebook"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									id="Bold"
									enable-background="new 0 0 24 24"
									height="25px"
									viewBox="0 0 24 24"
									width="25px"
								>
									<path
										d="m15.997 3.985h2.191v-3.816c-.378-.052-1.678-.169-3.192-.169-3.159 0-5.323 1.987-5.323 5.639v3.361h-3.486v4.266h3.486v10.734h4.274v-10.733h3.345l.531-4.266h-3.877v-2.939c.001-1.233.333-2.077 2.051-2.077z"
									></path>
								</svg>
							</a>
							<a
								href="https://www.linkedin.com/company/intangible-solutions"
								target="_blank"
								rel="nofollow"
								aria-label="pinterest"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									version="1.1"
									id="Capa_1"
									x="0px"
									y="0px"
									width="25px"
									height="25px"
									viewBox="0 0 480.666 480.666"
									style="enable-background:new 0 0 480.666 480.666;"
									xml:space="preserve"
								>
									<g id="pinterest_2_">
										<g>
											<path
												d="M240.35,0.008C107.612,0.008,0,107.605,0,240.31c0,98.431,59.168,182.967,143.867,220.133    c-0.717-16.795-0.157-36.918,4.145-55.17c4.646-19.522,30.957-130.976,30.957-130.976s-7.669-15.345-7.669-38.009    c0-35.623,20.637-62.215,46.323-62.215c21.885,0,32.421,16.429,32.421,36.076c0,21.962-13.996,54.85-21.198,85.283    c-6.016,25.5,12.781,46.301,37.907,46.301c45.545,0,76.221-58.506,76.221-127.781c0-52.66-35.478-92.087-100.006-92.087    c-72.916,0-118.305,54.359-118.305,115.077c0,20.949,6.142,35.702,15.837,47.127c4.428,5.268,5.051,7.388,3.43,13.405    c-1.154,4.427-3.773,15.072-4.895,19.28c-1.592,6.096-6.516,8.262-12.033,6.033c-33.573-13.733-49.192-50.471-49.192-91.814    c0-68.279,57.578-150.125,171.736-150.125c91.773,0,152.189,66.377,152.189,137.654c0,94.277-52.434,164.723-129.713,164.723    c-25.937,0-50.346-14.045-58.701-29.975c0,0-13.965,55.389-16.894,66.065c-5.113,18.517-15.089,37.058-24.193,51.491    c21.605,6.375,44.454,9.85,68.116,9.85c132.736,0,240.316-107.595,240.316-240.348C480.666,107.605,373.086,0.008,240.35,0.008z"
											></path>
										</g>
									</g>
								</svg>
							</a>
							<a
								href="https://www.linkedin.com/company/intangible-solutions"
								target="_blank"
								rel="nofollow"
								aria-label="twitter"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									id="Capa_1"
									enable-background="new 0 0 512 512"
									height="25px"
									viewBox="0 0 512 512"
									width="25px"
								>
									<g
										><path
											d="m480.32 128.39c-29.22 0-56.18-9.68-77.83-26.01-24.83-18.72-42.67-46.18-48.97-77.83-1.56-7.82-2.4-15.89-2.48-24.16h-83.47v228.08l-.1 124.93c0 33.4-21.75 61.72-51.9 71.68-8.75 2.89-18.2 4.26-28.04 3.72-12.56-.69-24.33-4.48-34.56-10.6-21.77-13.02-36.53-36.64-36.93-63.66-.63-42.23 33.51-76.66 75.71-76.66 8.33 0 16.33 1.36 23.82 3.83v-62.34-22.41c-7.9-1.17-15.94-1.78-24.07-1.78-46.19 0-89.39 19.2-120.27 53.79-23.34 26.14-37.34 59.49-39.5 94.46-2.83 45.94 13.98 89.61 46.58 121.83 4.79 4.73 9.82 9.12 15.08 13.17 27.95 21.51 62.12 33.17 98.11 33.17 8.13 0 16.17-.6 24.07-1.77 33.62-4.98 64.64-20.37 89.12-44.57 30.08-29.73 46.7-69.2 46.88-111.21l-.43-186.56c14.35 11.07 30.04 20.23 46.88 27.34 26.19 11.05 53.96 16.65 82.54 16.64v-60.61-22.49c.02.02-.22.02-.24.02z"
										></path></g
									>
								</svg>
							</a>
						</div>
					</div>
					<div class="socialIcons">
						<div class="logo-copy">
							<img src="/ins.webp" alt="INS" height="200px" width="200px" />
							<p>© 2024 Intangible Solutions</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.container {
		max-width: 1440px;
		margin: 0 auto;
		position: sticky;
		top: 0;
		background: white;
		z-index: 999;
		transition: top 1s ease-in-out;
	}
	.scrolled {
		top: -115px;
		transition: top 0.5s ease-in-out;
	}
	.marginTop {
		margin-top: 60px;
	}
	.navbar {
		position: sticky;
		top: 0;
	}
	.customSearchBar {
		position: absolute;
		width: 100%;
		height: 96px;
		top: 163px;
		opacity: 1;
		background: #fff;
	}
	.customCross {
		position: relative;
		height: 20px;
		text-align: right;
		padding-right: 10px;
	}
	.customCross svg {
		cursor: pointer;
	}
	.mblSearchIcon {
		cursor: pointer;
	}
	.containerFluid {
		width: 100%;
		margin-right: auto;
		margin-left: auto;
	}
	.containerFluid .row {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		margin-right: 0;
		margin-left: 0;
	}
	.colLg {
		position: relative;
		width: 100%;
		padding-right: 1rem !important;
		padding-left: 1rem !important;
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
		border-right: 0 !important;
		border-left: 0 !important;
		border-top: 0 !important;
		border-color: #373735;
		background-color: transparent;
		height: auto !important;
	}
	.inputGroupAppend {
		display: flex;
		margin-left: -1px;
	}
	.inputGroupAppend .btn {
		position: relative;
		z-index: 2;
		letter-spacing: 1px;
		line-height: 1rem;
		font-size: 1rem;
	}

	.navbar-nav {
		display: flex;
		justify-content: center;
		padding: 20px;
		margin-top: -50px;
		gap: 30px;
		list-style: none;
	}
	.mobileMenu {
		display: none;
	}

	.megaMenuDropDown {
		display: none;
		position: absolute;
		left: 0;
		top: 0;
		background-color: #fff5f5;
		min-width: 100%;
		box-shadow: 0 8px 16px #0003;
		z-index: 999999;
		transition: all 0.5s ease-in-out;
	}

	.megaMenu:hover .megaMenuDropDown {
		display: block;
	}

	.megaMenuDropDownContainer {
		display: flex;
		justify-content: center;
		max-width: 1392px;
		margin: 0 auto;
		padding: 25px 0;
		min-height: 280px;
	}
	.megaMenuCol {
		width: 20%;
	}
	.megaSubMenu {
		display: flex;
		flex-direction: column;
	}
	.megaSubMenuHeading {
		font-size: 18px;
		line-height: 1rem;
		margin-bottom: 15px;
	}
	.megaSubMenuItem {
		margin-bottom: 10px;
		font-size: 15px;
		display: block;
		cursor: pointer;
	}
	.subMenuImage {
		object-fit: cover;
		width: 200px;
		height: 200px;
	}

	.swatch {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.swatchImage {
		border-radius: 50%;
		object-fit: cover;
	}

	.link:hover {
		text-decoration: underline;
	}
	.menuLink {
		text-decoration: none;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding: 0 13px 13px;
		font-size: 14px;
		font-family: Poppins;
		letter-spacing: 1px;
	}

	a {
		text-decoration: none;
		color: #373735;
		transition: 0.5s;
	}

	.main {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
	}
	.customHeaderContainer {
		position: relative;
		z-index: 9999;
	}
	.desktopHeader {
		min-height: 36px;
		background-color: #245490;
		color: #fff;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0 20px;
	}
	.mobileHeader {
		display: none;
		background: #245490;
		color: #fff;
		width: 100%;
		padding: 6px 10px;
		min-height: 36px;
	}
	.mobileHeaderSliderDiv {
		overflow: hidden;
	}
	.headerInner {
		display: flex;
		justify-content: space-between;
		max-width: 1100px;
		margin: 0 auto;
		width: 100%;
		align-items: center;
	}
	.headerBlock {
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}
	.headerImage {
		height: 24px;
		width: 24px;
		display: flex;
		align-items: center;
	}
	.headerImage img {
		max-width: 100%;
	}
	.headerText {
		font-size: 14px;
		line-height: 18px;
		font-family: Poppins;
		font-weight: 400;
		margin: 0;
	}
	.upper {
		display: flex;
		width: 100%;
		max-width: 1440px;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}
	.logo {
		display: flex;
		width: 57%;
		justify-content: end;
	}
	.hidden {
		display: none;
	}
	.cart {
		display: flex;
		width: 37%;
		gap: 30px;
	}
	.cartCount {
		position: absolute;
		top: 60%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.cartCountMobile {
		position: absolute;
		top: 44%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 12px;
	}
	.input-group input,
	button {
		border: none;
		background-color: transparent;
	}
	.input-group input:focus {
		outline: none;
	}
	.inputGroup input:focus {
		outline: none;
	}
	.input-group {
		display: flex;
		width: 350px;
		justify-content: space-between;
		border-bottom: 1px solid black;
	}
	.searchResultsMain {
		display: none;
		position: absolute;
		top: 115px;
		left: 500px;
		max-height: 800px;
		width: 80%;
		max-width: 900px;
		padding: 0;
		margin: 0;
		margin-top: 6px;
		background-color: white;
		z-index: 800;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.searchResultsMainMobile {
		display: none;
		position: absolute;
		top: 45px;
		left: 5px;
		max-height: 550px;
		width: 100%;
		max-width: 745px;
		padding: 0;
		margin: 0;
		margin-top: 6px;
		background-color: white;
		z-index: 800;
		overflow-x: hidden;
		overflow-y: scroll;
		margin-bottom: 10px;
	}
	.content {
		padding: 20px;
	}
	.suggestionAndResults {
		display: flex;
		width: 100%;
		gap: 20px;
	}
	.suggestions {
		display: flex;
		flex-direction: column;
		width: 45%;
		gap: 20px;
	}
	.popularSearches {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 20px;
		padding: 10px;
	}
	.popularSearchesLabel {
		font-size: 14px;
		margin: 0 8px 4px;
		padding: 0 0 7px;
		border-bottom: 1px solid #000;
		text-transform: uppercase;
	}
	.popularListItem {
		cursor: pointer;
		margin: 0;
		color: #333;
		padding: 8px;
		display: flex;
		align-items: center;
		font-size: 14px;
		height: 36px;
		white-space: pre;
		font-weight: bold;
	}
	.popularListItem::before {
		background-repeat: no-repeat;
		background-image: url('/search.svg');
		content: '';
		display: inline-block;
		width: 22px;
		height: 22px;
		background-size: 22px;
		margin-right: 5px;
		flex-shrink: 0;
	}
	.categoryListItem {
		margin: 0;
		box-sizing: border-box;
		cursor: pointer;
		color: #333;
		padding: 8px;
		display: flex;
		align-items: center;
		font-size: 14px;
		height: 36px;
		white-space: pre;
	}
	.categories {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 20px;
		padding: 10px;
	}
	.categories ul {
		list-style-type: none;
	}
	.searchHeader {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #000;
		padding: 8px;
	}
	.productLabel {
		font-size: 14px;
		margin-left: 5px;
		text-align: left;
		text-transform: uppercase;
	}
	.noResults {
		display: flex;
		justify-content: start;
		width: 100%;
		font-size: 14px;
		padding: 0 11px 11px 0;
		font-style: italic;
		margin-left: 10px;
	}
	.searchResults {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		gap: 19px;
	}
	.results {
		display: flex;
		flex-direction: column;
		width: 50%;
		gap: 20px;
	}
	.results button {
		cursor: pointer;
	}
	.searchResultsMainMobile .searchResults {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		gap: 18px;
		margin-top: 10px;
	}
	.searchProductCard {
		display: flex;
		flex-direction: column;
		width: 30%;
	}
	.searchProductImage {
		object-fit: cover;
		width: 100%;
		max-width: 120px;
		height: 150px;
	}
	.searchProductTitle {
		font-size: 12px;
		margin-bottom: 3px;
		margin-top: 3px;
		color: #333;
		min-height: 30px;
	}
	.searchProductTitle:hover {
		text-decoration: underline;
	}
	.searchProductPrice {
		font-size: 12px;
		line-height: 20px;
		font-weight: 600;
		color: #333;
	}
	.cartIcon {
		position: relative;
		cursor: pointer;
	}
	.footerDiv {
		display: flex;
		width: 100%;
		background: #fff5f5;
	}
	.footerMainDivDesktop {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 50px;
		padding: 50px 76px;
	}
	.footerMainDivMobile {
		display: none;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}
	.footerContainer {
		display: flex;
		flex-wrap: wrap;
		margin-right: 0;
		margin-left: 0;
		justify-content: center;
	}
	.mailingDiv {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		width: 100%;
		position: relative;
	}
	.mailingContent {
		margin-bottom: 1.5rem;
		margin-top: 1rem;
	}
	.headingMobile {
		font-size: 18px;
		font-weight: 400;
		line-height: 1rem;
		margin-bottom: 0.5rem;
	}
	.signupTextMobile {
		font-size: 12px;
		margin-bottom: 3px;
	}
	.formGroup {
		margin: 0;
	}
	.inputGroupMobile {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		width: 92%;
	}
	.formControlMobile {
		position: relative;
		flex: 1 1 auto;
		width: 1%;
		min-width: 0;
		margin-bottom: 0;
		font-weight: inherit;
		line-height: 1rem;
		font-size: 1.2em;
		border-color: #373735;
		height: auto;
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
	}
	.borderBottom {
		border-bottom: 2px solid #fff;
	}
	.inputGroupAppend {
		display: flex;
		margin-left: -1px;
	}
	.btnSubmitMobile {
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		padding: 0.375rem 0.75rem;
		border-radius: 0;
		background-color: transparent;
		color: #373735;
		border: 0;
		height: auto;
		text-transform: uppercase;
		font-weight: inherit;
		line-height: 1rem;
		font-size: 1em;
		letter-spacing: 1px;
		position: relative;
		cursor: pointer;
	}
	.footerMenuMobile {
		display: block;
		border-top: 2px solid #fff;
		text-align: center;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		flex: 0 0 100%;
		max-width: 100%;
		width: 100%;
		position: relative;
	}
	.footerMenuColCenter {
		text-align: center;
	}
	.footerMenuHeader {
		background-color: transparent;
		color: #373735;
		padding: 18px;
		border: none;
		text-align: left;
		font-size: 15px;
		transition: 0.4s;
		margin-bottom: 0;
		font-weight: 700;
		outline: none;
		cursor: pointer;
	}
	.footerMenuHeader::after {
		content: '+';
		color: #373735;
		font-weight: 700;
		float: right;
		margin-left: 10px;
	}
	.footerMenuContent {
		padding: 0 18px;
		max-height: 0;
		background-color: transparent;
		overflow: hidden;
		transition: max-height 0.4s ease-in-out;
	}
	.activeFo .footerMenuColCenter .footerMenuHeader::after {
		content: '-';
	}
	.activeFo .footerMenuColCenter .footerMenuContent {
		max-height: 300px;
	}
	.footerMenuContent p {
		line-height: 1rem;
		font-weight: 400;
		font-size: 14px;
		margin-bottom: 0.5rem;
		text-align: center;
		margin: 0 0 12px;
	}
	.socialIcons {
		text-align: center;
		margin-top: 30px;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		flex: 0 0 100%;
		max-width: 100%;
		width: 100%;
		position: relative;
	}
	.row-1 {
		display: flex;
		width: 100%;
	}
	.heading {
		color: #373735;
		font-size: 18px;
	}
	.mailing {
		display: flex;
		width: 40%;
		gap: 40px;
		flex-direction: column;
	}
	.mailing input {
		border-top: 0;
		border-bottom: 1px solid black;
		border-left: 0;
		border-right: 0;
		background-color: transparent;
		width: 52%;
	}
	.mailing input:focus {
		outline: none;
	}
	.mailing button {
		border: none;
		background: transparent;
		margin-left: 10px;
	}
	.signup-text {
		font-size: 12px;
		padding-left: 20px;
	}
	.column {
		display: flex;
		flex-direction: column;
		width: 20%;
		gap: 20px;
	}
	.dream {
		width: 110px;
	}
	.hiring {
		width: 100px;
	}
	.row-2 {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 10px;
	}
	.follow {
		color: #373735;
		font-weight: 600;
	}
	.icons {
		display: flex;
		width: 100%;
		gap: 10px;
	}
	.row-3 {
		display: flex;
		width: 100%;
		justify-content: center;
	}
	.logo-copy {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hamBurger {
		display: none;
	}
	.hamBurger button {
		cursor: pointer;
	}
	.sidebar {
		display: none;
		background-color: white;
		transform: translate(0px);
		transition: all 0.5s ease;
		position: fixed;
		top: 0;
		left: 0;
		width: 250px;
		height: 100%;
		z-index: 999999;
		overflow-y: auto;
	}

	.cartDrawer {
		background-color: white;
		transform: translate(0px);
		transition: all 0.5s ease;
		position: fixed;
		top: 0;
		right: -200%;
		width: 480px;
		height: 100%;
		z-index: 999999;
		overflow-y: auto;
	}
	.cartMain {
		display: flex;
		flex-direction: column;
		color: #000;
		height: 100%;
		width: 100%;
		max-width: 480px;
		padding: 12px 0 0;
		margin: 0;
		background: #fff;
		z-index: 97;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.shippingDetailsParent {
		padding: 0 25px;
	}
	.shippingDetails {
		width: 100%;
		text-align: center;
		height: 64px;
		background-color: #f9f5ef;
		padding: 1px 0 0;
	}
	.shippingText {
		font-family: Poppins;
		font-size: 12px;
		font-weight: 400;
		margin-bottom: 0;
		margin-top: 5px;
		margin-right: 5px;
	}
	.progressMain {
		display: flex;
		justify-content: center;
		width: 100%;
	}
	.progressContainer {
		display: flex;
		justify-content: start;
		align-items: center;
		margin-top: 5px;
		width: 80%;
		border: 1px solid #43434352;
		border-radius: 10px;
		height: 8.5px;
	}
	.progress {
		background-color: #245490;
		height: 8.5px;
		border-radius: 10px;
		transition: all 0.5s ease;
	}
	.shippingTextSpan {
		font-size: 13px;
		font-weight: 700;
	}

	.closeCart {
		text-align: right;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
		padding: 15px 25px 10px;
	}
	.cartTitle {
		margin: 0;
		padding: 0;
		font-size: 25px;
		line-height: 30px;
		font-weight: 400;
		text-transform: uppercase;
		text-align: center;
	}
	.prodTitle {
		margin: 0;
		font-size: 14px;
		line-height: 18px;
		font-weight: 400;
		width: 100%;
		color: #245490;
	}
	.closeCartButton {
		cursor: pointer;
		font-size: 40px;
		font-weight: 600;
		margin-bottom: 5px;
	}
	.cartProductInfo {
		padding: 0 25px;
	}
	.mainProduct {
		margin: 10px auto;
		padding: 0;
		width: 100%;
		height: 202px;
		display: flex;
		flex-direction: row;
	}
	.productImage img {
		width: 142px;
		height: 177px;
		max-width: 100%;
		vertical-align: middle;
		border-style: none;
		object-fit: cover;
	}
	.productText {
		width: 65%;
		height: 189px;
		padding-left: 5px;
		line-height: 2;
	}
	.titleCloseBtn {
		display: flex;
		justify-content: space-between;
		line-height: normal;
	}
	.titleCloseBtn a {
		width: 100%;
		max-width: 85%;
		outline: none;
		color: #373735;
		text-decoration: none;
		background-color: transparent;
	}
	.delProduct {
		display: flex;
		justify-content: end;
		width: 100%;
	}
	.prodPriceDiv {
		display: flex;
		width: 100%;
		margin: 8px 0 0;
	}
	.prodPrice {
		color: #000;
		background-color: #fff;
		border: none;
		margin-top: 0;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 0;
		margin-right: 6px;
		line-height: 1.4;
	}
	.prodColor {
		font-size: 11px;
		font-weight: 400;
		line-height: 18px;
		margin-top: 5px;
		text-transform: capitalize;
	}
	.prodSizeDiv {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-top: 5px;
	}
	.prodSize {
		font-size: 12px;
		line-height: 12px;
		font-weight: 400;
		margin-bottom: 0;
		margin-top: 0;
		margin-right: 5px;
	}
	.sizeValue {
		text-transform: uppercase;
	}
	.quantity {
		display: flex;
		align-items: baseline;
	}
	.quant {
		display: flex;
		align-items: center;
		gap: 10px;
		height: 30px;
		padding: 5px 5px;
	}
	.quantityButton {
		cursor: pointer;
		border: none;
		font-size: 13px;
		height: 19px;
		width: 19px;
		background-color: #245490;
		color: white;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 9px 9px;
	}
	.quantityValue {
		font-size: 14px;
	}
	.quantityText {
		margin: 0;
		font-size: 12px;
	}
	.cartTotalDiv {
		position: sticky;
		bottom: 0px;
		background: #fff;
		box-shadow: 0 -9px 7px -8px #0000001a;
		padding-left: 25px;
		padding-right: 25px;
		margin-top: auto;
	}
	.discount {
		width: 100%;
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 6px 0 10px;
	}
	.discount input {
		width: 100%;
		outline: none;
		border: 1px solid #e5e5e5;
		height: 50px;
		padding: 5px;
		border-radius: 10px;
	}
	.applyDiscount {
		background-color: #5a31f4;
		color: white;
		border: none;
		width: 26%;
		height: 47px;
		border-radius: 10px;
		font-size: 15px;
		cursor: pointer;
		margin: 10px 0;
		max-width: 80px;
	}
	.applyDiscount:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.appliedCodes {
		display: flex;
		gap: 5px;
		width: 100%;
	}
	.appliedCode {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #e5e5e5;
		border: 1px solid #e5e5e5;
		border-radius: 10px;
		padding: 5px;
		gap: 5px;
	}
	.appliedCode p {
		text-transform: uppercase;
		font-size: larger;
		font-weight: 500;
	}
	.cross {
		cursor: pointer;
		margin-bottom: 2px;
	}
	.noteMain {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 5px;
	}
	.note {
		width: 100%;
	}
	.noteDiv {
		display: flex;
		width: 90%;
		margin: 0 auto;
		padding: 0 25px;
		margin-bottom: 5px;
		background-color: #f9f5ef;
	}
	.noteDiv p {
		margin-top: 10px;
		margin-bottom: 10px;
		text-transform: capitalize;
	}
	.noteMain input {
		width: 80%;
		outline: none;
		border: 1px solid #e5e5e5;
		height: 50px;
		padding: 5px;
		border-radius: 10px;
		max-width: 340px;
	}
	.addNote {
		background-color: #245490;
		color: white;
		border: none;
		width: 21%;
		height: 47px;
		border-radius: 10px;
		font-size: 15px;
		cursor: pointer;
		margin: 10px 0;
		max-width: 80px;
		margin-left: 5px;
	}
	.addNote:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.cartTotal {
		max-width: 419px;
		height: auto;
		display: flex;
		flex-direction: column;
		padding: 10px 0 0;
		margin-bottom: 10px;
	}
	.cartTotalPrice {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 500;
		font-size: 15px;
		padding: 0 0 5px;
	}
	.subTotal {
		font-weight: 500;
		font-size: 15px;
		color: #000;
	}
	.prevAmount {
		font-weight: 700;
		font-size: 15px;
		color: #000;
		text-decoration: line-through;
		margin-right: 5px;
		color: red;
	}
	.cartButtons {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 6px 0 10px;
		border-top: 1px solid #e5e5e5;
	}
	.shopButton {
		border: none;
		background-color: #5a31f4;
		width: 200px;
		height: 50px;
		outline: none;
		text-transform: none;
		text-decoration: none;
		color: #fff;
		cursor: pointer;
	}
	.checkout {
		border: none;
		background-color: #5a31f4;
		width: 200px;
		height: 50px;
		outline: none;
		text-transform: none;
		text-decoration: none;
		color: #fff;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.cartBanner {
		display: block;
		position: sticky;
		top: 0;
		color: #000;
		width: 100%;
	}
	.bannerMainDiv {
		background-color: #ddecfb;
		padding: 10px;
	}
	.bannerText {
		color: #353535;
		font-weight: 500;
		font-size: 16px;
		line-height: 22px;
		text-align: center;
		text-transform: capitalize;
		margin-bottom: 0;
		margin-top: 0;
	}

	.emptyCart {
		display: flex;
		flex-direction: column;
		height: 315px;
		justify-content: center;
		align-items: center;
	}
	.emptyCartHeading {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		font-weight: 500;
		line-height: 1.2;
		margin-top: 0;
	}
	.emptyCartText {
		font-weight: 400;
		font-size: 15px;
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.shopBtn {
		background-color: #245490;
		color: #fff;
		width: 261px;
		height: 50px;
		border: none;
		margin-top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.sideBarContent {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.close {
		display: flex;
		justify-content: flex-start;
		margin-left: 10px;
		margin-top: 10px;
	}
	.close svg {
		cursor: pointer;
	}
	.mobileNavBarItem {
		position: relative;
	}
	.subMenu {
		position: absolute;
		display: block;
		top: 100%;
		left: 0;
		right: 0;
		border-top: 0;
		background: #f9f5ef;
		transition: all 0.5s;
		z-index: -1;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}
	.active {
		opacity: 1;
		visibility: visible;
		pointer-events: all;
		z-index: 2;
	}
	.subMenuContent {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px;
	}
	.hideSubMenu {
		display: none;
	}
	.formInline {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		margin-left: 1rem;
		margin-right: 1rem;
	}
	.formInline .inputGroup {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		width: 92%;
		margin-bottom: 0.25rem;
	}
	.formInline .inputGroup .formControl {
		position: relative;
		flex: 1 1 auto;
		width: 1%;
		min-width: 0;
		margin-bottom: 0;
	}
	.formInline .inputGroup .inputGroupAppend {
		display: flex;
		margin-left: -1px;
	}

	.mobileNavBarMain {
		list-style: none;
	}

	.titleAndIcon {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #e5e5e5;
		width: 85%;
		padding: 20px 0;
		margin: 0 auto;
	}
	.showSubMenu,
	.hideSubMenu {
		cursor: pointer;
	}
	.borderBottomMobileNav {
		border-bottom: 1px solid #e5e5e5;
		margin-bottom: 10px;
	}
	.mobileNavBarLink {
		margin-left: 10px;
	}

	@media (min-width: 1441px) {
		.container {
			max-width: 100%;
		}
		.upper {
			max-width: 100%;
		}
		.searchResultsMain {
			left: 46%;
		}
		.cartMain {
			max-width: 500px;
		}
	}
	@media screen and (max-width: 1024px) {
		.searchResultsMain {
			left: 200px;
		}
	}
	@media screen and (min-width: 769px) {
		.customSearchBar {
			display: none;
		}
		.searchResultsMainMobile {
			display: none;
		}
	}
	@media screen and (max-width: 768px) {
		.footerMainDivDesktop {
			display: none;
		}
		.footerMainDivMobile {
			display: block;
		}
		.navbar {
			display: none;
		}
		.hamBurger {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.sidebar {
			display: block;
			left: -100%;
		}
		.cart {
			display: none;
		}
		.mobileMenu {
			display: flex;
			width: 37%;
			gap: 30px;
			justify-content: flex-end;
			align-items: center;
			padding: 20px;
		}
		.row-2 {
			align-items: center;
			margin-top: 30px;
		}
		.icons {
			justify-content: center;
		}
		.searchResultsMain {
			display: none;
		}
		.searchResultsMainMobile .closeCartButton {
			display: none;
		}
		.searchResultsMainMobile .results {
			width: 55%;
		}
		.searchResultsMainMobile .suggestions {
			width: 45%;
		}
		.searchResultsMainMobile .searchProductCard {
			width: 35%;
		}
		.scrolled {
			top: -87px;
		}
		.desktopHeader {
			display: none;
		}
		.mobileHeader {
			display: block;
		}
		.headerBlock {
			justify-content: center;
			width: 100%;
		}
	}
	@media screen and (max-width: 700px) {
		.searchResultsMainMobile {
			max-height: 800px;
		}
		.searchResultsMainMobile .suggestionAndResults {
			flex-direction: column;
		}
		.searchResultsMainMobile .suggestions {
			width: 100% !important;
		}
		.searchResultsMainMobile .results {
			width: 100% !important;
		}
		.searchResultsMainMobile .searchProductCard {
			width: 25%;
		}
	}
	@media screen and (max-width: 600px) {
		.upper {
			height: 80px;
		}
		.ins {
			height: 100px;
			width: 100px;
		}
		.intangible {
			height: 50px;
			width: 100px;
		}
		.logo {
			width: 49%;
		}
		.scrolled {
			top: 0;
		}
		.customSearchBar {
			top: 80px;
		}
		.noteMain input {
			width: 75%;
			height: 40px;
		}
		.addNote {
			width: 21%;
			font-size: 12px;
			height: 38px;
		}
		.discount input {
			width: 76%;
			height: 40px;
		}
		.applyDiscount {
			width: 21%;
			font-size: 13px;
			height: 39px;
		}
		.appliedCode {
			font-size: 12px;
		}
		.tag {
			width: 15px;
			height: 15px;
		}
	}
	@media screen and (max-width: 570px) {
		.column {
			width: 80%;
		}
		.column p {
			font-size: 12px;
		}
		.heading {
			font-size: 12px;
		}
		.signup-text {
			font-size: 10px;
			padding: 0;
		}
		.mailing {
			width: 80%;
		}
		.formInline .inputGroup {
			width: auto;
		}
		.cartDrawer {
			max-width: 335px;
		}
	}
	@media screen and (max-width: 480px) {
		.searchResultsMainMobile .searchResults .searchProductCard {
			width: 35%;
		}
		.footerDiv {
			height: 615px;
		}
	}
	@media screen and (max-width: 380px) {
		.searchResultsMainMobile .searchResults .searchProductCard {
			width: 47%;
		}
		.searchResultsMainMobile .searchResults {
			justify-content: center;
		}
		.searchProductImage {
			max-width: 100%;
			height: 200px;
		}
	}
</style>
