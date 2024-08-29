import { cartLinesRemove } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request, cookies }) {
	const cartId = cookies.get('cart-id');
	const { lineIds } = await request.json();
	const res = await cartLinesRemove(cartId, lineIds);
	const {
		data: { cartLinesRemove: lines }
	} = res;
	if (lines !== null) {
		return json(true);
	}
	return json(false);
}
