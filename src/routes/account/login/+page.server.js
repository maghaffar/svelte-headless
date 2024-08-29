import { fail, redirect } from '@sveltejs/kit';
import { customerAccessTokenCreate } from '../../../utils.js';

export const load = ({ cookies }) => {
	const accessToken = cookies.get('accessToken');
	if (accessToken) {
		redirect(303, '/account');
	}
};
export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const response = await customerAccessTokenCreate(email, password);

		if (!email || !password) {
			return fail(400, { missing: true });
		}

		if (response.data.customerAccessTokenCreate.customerUserErrors.length > 0) {
			return fail(400, { invalid: true });
		}
		if (response.data.customerAccessTokenCreate.customerAccessToken != null) {
			const accessToken = cookies.get('accessToken');
			if (!accessToken) {
				cookies.set(
					'accessToken',
					response.data.customerAccessTokenCreate.customerAccessToken.accessToken,
					{ path: '/', maxAge: 86400 }
				);
			}
			redirect(303, '/account');
		}
	}
};
