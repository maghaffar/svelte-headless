import { redirect } from '@sveltejs/kit';
import { getCustomer } from '../../utils.js';
export const load = async ({ cookies }) => {
	const accessToken = cookies.get('accessToken');
	if (!accessToken) {
		redirect(303, '/account/login');
	}
	const res = await getCustomer(accessToken);
	const {
		data: { customer }
	} = res;
	return {
		customer
	};
};
