<script>
	export let data;
	$: article = data.article;
	$: dataFetched = true;
	if (!article) {
		dataFetched = false;
	}
</script>

{#if dataFetched}
	<div class="article">
		<div class="banner">
			<img src={`${article.image.url}&width=1600`} alt={`${article.title}`} class="bannerImage" />
		</div>
		<div class="content">
			<h2>{article.title}</h2>
			{#if article.excerpt}
				<p class="excerpt">{article.excerpt}</p>
			{/if}
			<p>{@html article.content}</p>
		</div>
	</div>
{:else}
	<div class="notFound">
		<h1>Article Not Found!</h1>
	</div>
{/if}

<style>
	.article {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 5%;
	}
	.banner {
		width: 100%;
	}
	.bannerImage {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.content {
		display: flex;
		width: 50%;
		flex-direction: column;
		align-items: flex-start;
	}
	.excerpt {
		color: gray;
		font-size: 20px;
		font-style: italic;
	}
	.notFound {
		display: flex;
		justify-content: center;
	}
	@media only screen and (max-width: 500px) {
		.content {
			width: 90%;
		}
	}
</style>
