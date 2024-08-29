import { error } from '@sveltejs/kit';
import { getProducts } from '../../../utils';

export async function load() {
	let {
		data: {
			products: { edges }
		}
	} = await getProducts();

	if (!edges) {
		throw error(500, 'Something went wrong');
	}
	return {
		edges
	};
}
