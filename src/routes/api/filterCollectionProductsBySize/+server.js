import { filterCollectionProductsBySize } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { collectionHandle, size } = await request.json();
	const res = await filterCollectionProductsBySize(collectionHandle, size);
	return json(res.data);
}
