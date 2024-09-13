<script>
	export let data;
	$: customer = data.customer;
</script>

<svelte:head>
	<title>Account</title>
</svelte:head>

<div class="account">
	<div class="container">
		<div class="row">
			<div class="col">
				<div class="title">
					<h1>My Account</h1>
				</div>
			</div>
			<div class="signOut">
				<a href="/account/logout" class="signOutBtn">Sign Out</a>
			</div>
		</div>
		<div class="row">
			<div class="noOfOrders">
				{#if customer?.numberOfOrders > 0}
					<p>
						You have placed {customer?.numberOfOrders}
						{customer?.numberOfOrders == 1 ? 'Order' : 'Orders'}
					</p>
				{:else}
					<p>You haven't placed any orders yet.</p>
				{/if}
			</div>
			<div class="addressDiv">
				<p class="title">Primary Address</p>
				<div class="address">
					<p>{customer?.displayName} <br /> United States</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.account {
		padding: 3rem 0;
		margin: 3rem 0;
	}
	.container {
		width: 60%;
		padding-right: 15px;
		padding-left: 15px;
		margin-right: auto;
		margin-left: auto;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		margin-right: -15px;
		margin-left: -15px;
	}
	.col {
		flex-basis: 0;
		flex-grow: 1;
		max-width: 100%;
		position: relative;
		width: 100%;
		padding-right: 15px;
		padding-left: 15px;
	}
	.title {
		text-align: left;
	}
	.title h1 {
		margin-bottom: 3rem;
		margin-top: 0;
	}
	.signOut {
		flex: 0 0 auto;
		width: auto;
		max-width: 100%;
		position: relative;
		padding-right: 15px;
		padding-left: 15px;
	}
	.signOutBtn {
		cursor: pointer;
		text-decoration: none;
		color: #373735;
		font-size: 1em;
		font-weight: inherit;
		line-height: 1rem;
	}
	.noOfOrders {
		flex: 0 0 75%;
		max-width: 75%;
		position: relative;
		width: 100%;
		padding-right: 15px;
		padding-left: 15px;
	}
	.addressDiv {
		flex: 0 0 18%;
		max-width: 18%;
		position: relative;
		width: 100%;
		padding-right: 15px;
		padding-left: 15px;
	}
	.title {
		text-align: left;
		margin-bottom: 1rem;
		margin-top: 0;
		font-size: inherit;
	}
	.address p {
		margin-bottom: 3rem;
	}
</style>
