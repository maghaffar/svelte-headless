import { cartLinesAdd } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request, cookies }) {
	let cartId = cookies.get('cart-id');
	const { merchandiseId, quantity } = await request.json();
	try {
		const res = await cartLinesAdd(cartId, merchandiseId, quantity);

		if (res?.data?.cartLinesAdd.userErrors.length > 0) {
			return json(false);
		} else if (res?.errors) {
			return json(false);
		} else {
			return json(true);
		}
	} catch (error) {
		return error;
	}
}
