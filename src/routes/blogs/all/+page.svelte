<script>
	export let data;
	const blogs = data.blogs;
</script>

<div class="container">
	<h1>Blogs</h1>
	<div class="main">
		<div class="blogs">
			{#if blogs}
				{#each blogs as blog}
					<div class="link">
						<div>
							<h1 class="title">{blog.title}</h1>
							{#if blog.articles?.nodes}
								<ul>
									{#each blog.articles?.nodes as article}
										<li>
											<a href={`/blogs/${blog.handle}/${article.handle}`} class="articleTitle"
												>{article.title}</a
											>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						{#if blog.articles?.nodes.length > 0}
							<a href={`/blogs/${blog.handle}`} class="seeMoreButton">See More</a>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1440px;
		margin: 0 auto;
	}
	.blogs {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin: 0 auto;
	}
	.link {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 20%;
		height: 300px;
		font-weight: bold;
		border: 1px solid black;
		padding: 10px;
		border-radius: 10px;
	}
	.blogs .link ul li {
		padding: 10px;
	}
	.title {
		margin: 0;
		background-color: wheat;
		text-align: center;
		border-radius: 10px;
		padding: 10px;
		font-size: x-large;
	}
	.seeMoreButton {
		text-decoration: none;
		color: black;
		text-align: center;
		border: 1px solid black;
		width: 50%;
		margin: 0 auto;
		padding: 5px;
		border-radius: 10px;
	}
	.articleTitle {
		text-decoration: none;
		color: black;
	}
</style>
