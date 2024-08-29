import { cartDiscountCodesUpdate } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { cartId, code } = await request.json();
	const res = await cartDiscountCodesUpdate(cartId, code);
	return json(res.data);
}
