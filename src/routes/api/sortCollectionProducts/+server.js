import { getSortedCollectionProducts } from '../../../utils.js';
import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { collectionHandle, sortKey, reverse, selectedSizeVal } = await request.json();
	const products = await getSortedCollectionProducts(
		collectionHandle,
		sortKey,
		reverse,
		selectedSizeVal
	);
	const {
		data: { collection }
	} = products;
	return json(collection);
}
