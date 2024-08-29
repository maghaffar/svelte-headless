<script>
	export let data;
	const articles = data.articles;
	const blog = data.blog;
</script>

<div class="container">
	<h1>{blog.title}</h1>
	<div class="main">
		{#if articles.nodes.length > 0}
			{#each articles.nodes as article}
				<div class="article">
					<h1>{article.title}</h1>
					<p>{article.excerpt}</p>
					<a href={`/blogs/${article.blog.handle}/${article.handle}`} class="readBtn">Read</a>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 1440px;
		margin: 0 auto;
	}
	.main {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin: 0 auto;
	}
	.article {
		display: flex;
		flex-direction: column;
		align-items: start;
		margin: 0 auto;
		border: 1px solid black;
		padding: 20px;
		border-radius: 10px;
		width: 60%;
	}
	.readBtn {
		text-decoration: none;
		color: black;
		background-color: wheat;
		font-size: larger;
		padding: 5px;
		border-radius: 10px;
		width: 10%;
		text-align: center;
		font-weight: bold;
	}
	@media screen and (max-width: 500px) {
		.readBtn {
			width: 25%;
		}
	}
</style>
