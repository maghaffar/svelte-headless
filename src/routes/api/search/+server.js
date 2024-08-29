import { searchProducts } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { query } = await request.json();
	const res = await searchProducts(query);
	return json(res.data);
}
