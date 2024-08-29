<script>
	import { page } from '$app/stores';
</script>

<div>
	<h1>Oops!</h1>
	<h4>{$page.error.message}</h4>
</div>

<style>
	div {
		padding: 10%;
	}
	h1 {
		text-align: center;
		font-size: 100px;
	}

	h4 {
		text-align: center;
		font-size: x-large;
	}
</style>
