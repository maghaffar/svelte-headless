import { redirect } from '@sveltejs/kit';
export const load = async ({ cookies }) => {
	const accessToken = cookies.get('accessToken');
	if (!accessToken) {
		redirect(303, '/');
	}
	cookies.delete('accessToken', { path: '/' });
	redirect(303, '/');
	return {};
};
