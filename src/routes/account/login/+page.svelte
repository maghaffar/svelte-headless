<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="container">
	<div class="main">
		<div class="signinImageDiv">
			<h2>Join The INS Community & Keep Tracking of All The Items You Love</h2>
		</div>
		<div class="signinFormDiv">
			<div class="signinForm">
				<p class="signInText">Sign In</p>
				<form method="POST" action="?/login" use:enhance>
					{#if form?.missing}<p class="error">*Please fill out all fields</p>{/if}
					{#if form?.invalid}<p class="error">*Incorrect email or password</p>{/if}
					<input type="email" name="email" placeholder="Email" />
					<input type="password" name="password" placeholder="Password" />
					<button type="submit" class="btnSubmit" aria-label="Sign In">SIGN IN</button>
				</form>
				<a class="forgotPassword" href="/account/login" aria-label="Forgot Password">
					Forgot your password?
				</a>
				<a class="register" href="/account/register"
					>Don't have an account? <b><a href="/account/register">Sign up</a></b> for faster
					checkout, detailed order history, and to become a member of our loyalty program, the
					<b>Printfresh Dream Team</b>.</a
				>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		max-width: 1440px;
	}
	.main {
		display: flex;
		width: 100%;
		height: 59vh;
		min-height: 470px;
		max-width: 100%;
	}
	.signinImageDiv {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 50%;
		background-image: url('/signin.jpeg');
		background-size: cover;
	}
	.signinImageDiv h2 {
		color: white;
		font-size: 39px;
		line-height: 50px;
		text-align: left;
		width: 100%;
	}
	.signinFormDiv {
		height: 100%;
		width: 50%;
		padding: 58px;
		margin-right: auto;
	}

	.signInText {
		font-size: 32px;
		margin-bottom: 24px;
	}
	.signinForm {
		display: flex;
		flex-direction: column;
	}
	form {
		margin-bottom: 10px;
	}
	.btnSubmit {
		display: block;
		width: 70%;
		text-transform: uppercase;
		background-color: #373735;
		color: white;
		padding: 9px 18px;
		font-size: 13px;
		line-height: 1rem;
		cursor: pointer;
	}
	.signinForm input {
		margin-bottom: 20px;
		padding: 16px;
		border: 1px solid #e7e7e7;
		line-height: 1rem;
		font-size: 14px;
		width: 70%;
		color: #373735;
	}
	.forgotPassword {
		text-align: left;
		padding: 0;
		color: #373735;
		cursor: pointer;
		font-size: 14px;
		font-weight: 400;
		line-height: 24px;
		margin-top: 10px;
		text-decoration: none;
	}
	.register {
		display: block;
		width: 65%;
		font-size: 16px;
		font-weight: 400;
		line-height: 30px;
		text-align: left;
		padding: 0;
		color: #373735;
		margin-top: 0.5rem;
		text-decoration: none;
	}
	.register b {
		color: #245490;
		text-transform: capitalize;
	}
	.register b a {
		color: #245490;
		text-decoration: none;
		text-transform: uppercase;
	}
	.error {
		color: red;
	}
	@media screen and (max-width: 1024px) {
		.register {
			width: 100%;
		}
		.signinForm input {
			width: 100%;
		}
		.btnSubmit {
			width: 100%;
		}
	}
	@media (max-width: 768px) {
		.main {
			flex-direction: column-reverse;
			height: 80vh;
		}
		.signinImageDiv {
			width: 100%;
		}
		.signinFormDiv {
			width: 100%;
			padding: 0 15px;
			margin: 0;
		}
		.signinFormDiv .signinForm form {
			width: 100%;
		}
		.signInText {
			text-align: left;
		}
	}
	@media screen and (max-width: 600px) {
		.signInText {
			text-align: center;
		}
	}
</style>
