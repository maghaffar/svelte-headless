import { customerCreate, customerAccessTokenCreate } from '../../../utils.js';
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
	register: async ({ request, cookies }) => {
		const data = await request.formData();
		const firstName = data.get('firstName');
		const lastName = data.get('lastName');
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !firstName || !lastName || !password) {
			return fail(400, { missing: true });
		}

		const res = await customerCreate(firstName, lastName, email, password);
		if (res.data.customerCreate != null) {
			if (res.data.customerCreate.customerUserErrors.length > 0) {
				if (res.data.customerCreate.customerUserErrors[0].code === 'TAKEN') {
					return fail(400, { emailTaken: true });
				}
			}
			if (res.data.customerCreate.customer != null) {
				const response = await customerAccessTokenCreate(email, password);
				if (response.data.customerAccessTokenCreate.customerAccessToken != null) {
					const accessToken = cookies.get('accessToken');
					if (!accessToken) {
						cookies.set(
							'accessToken',
							response.data.customerAccessTokenCreate.customerAccessToken.accessToken,
							{ path: '/', maxAge: 86400 }
						);
					}
				}
				redirect(303, '/');
			}
		}
	}
};
