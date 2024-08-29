import { cartNoteUpdate } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { cartId, note } = await request.json();
	const res = await cartNoteUpdate(cartId, note);
	return json(res?.data);
}
