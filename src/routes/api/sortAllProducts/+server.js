import { getSortedProducts } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { sortKey, reverse } = await request.json();
	const res = await getSortedProducts(sortKey, reverse);
	return json(res.data);
}
