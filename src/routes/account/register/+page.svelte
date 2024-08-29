<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="main">
	<div class="signinImageDiv">
		<h2>Join The Printfresh Dream Team & Keep Tracking of All The Items You Love</h2>
		<p>
			Register for an account for faster checkout, detailed order history, and to become a member of
			our loyalty program.<span
				>Learn more about amazing (and free!) members-only perks on our Rewards page.</span
			>
		</p>
	</div>
	<div class="signinFormDiv">
		<div class="signinForm">
			<div>
				<p class="signInText">Sign Up</p>
				{#if form?.emailTaken}
					<p class="alreadyExists">
						This email address is already associated with an account. If this account is yours, you
						can reset your password
					</p>
				{/if}
				<form method="POST" action="?/register" use:enhance>
					{#if form?.missing}<p class="error">*Please fill out all fields</p>{/if}
					<div class="input-group">
						<input type="text" name="firstName" placeholder="First Name" />
						<input type="text" name="lastName" placeholder="Last Name" />
					</div>
					<input type="email" name="email" placeholder="Email" />
					<input type="password" name="password" placeholder="Password" />
					<button type="submit" class="btnSubmit">SIGN UP</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.main {
		display: flex;
		width: 100%;
		height: 59vh;
		min-height: 500px;
	}
	.signinImageDiv {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 10px;
		padding: 24px;
		height: 92%;
		width: 50%;
		background-image: url('/signin.jpeg');
		background-size: cover;
	}
	.signinImageDiv h2 {
		font-size: 39px;
		font-weight: 400;
		line-height: 58px;
		text-align: left;
		color: white;
		width: 100%;
		margin-bottom: 0.5rem;
		margin-top: 0;
	}
	.signinImageDiv p {
		font-size: 19px;
		font-weight: 400;
		line-height: 34px;
		text-align: left;
		color: white;
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.signinImageDiv p span {
		font-size: 14.68px;
		font-weight: 400;
		line-height: 24px;
		text-align: left;
		display: block;
		margin-top: 16px;
		color: white;
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
	.input-group {
		display: flex;
		gap: 20px;
		width: 70%;
	}
	.input-group input {
		width: 50%;
	}
	.error {
		color: red;
	}
	.alreadyExists {
		color: #373735;
		width: 80%;
	}
	@media screen and (max-width: 1024px) {
		.signinForm input {
			width: 100%;
		}
		.btnSubmit {
			width: 100%;
		}
		.input-group {
			width: 100%;
		}
	}
	@media (max-width: 768px) {
		.signinImageDiv h2 {
			font-size: 30px;
		}
		.main {
			flex-direction: column-reverse;
			height: 85vh;
		}
		.signinImageDiv {
			width: 100%;
		}
		.signinFormDiv {
			width: 100%;
			padding: 0 15px;
			margin: 0;
		}
		.signinForm {
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
	@media (max-width: 480px) {
		.main {
			height: auto;
		}
	}
</style>
