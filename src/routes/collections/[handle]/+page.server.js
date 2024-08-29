import { error } from '@sveltejs/kit';
import { getCollectionProducts } from '../../../utils.js';
export async function load({ params }) {
	const products = await getCollectionProducts(params.handle);
	const {
		data: { collection }
	} = products;

	if (!products) {
		throw error(500, 'Something went wrong');
	}
	return {
		collection
	};
}
