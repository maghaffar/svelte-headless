import { error } from '@sveltejs/kit';
import { getProducts } from '../../../utils';

export async function load() {
	let {
		data: {
			products: { nodes }
		}
	} = await getProducts();

	if (!nodes) {
		throw error(500, 'Something went wrong');
	}
	return {
		nodes
	};
}
