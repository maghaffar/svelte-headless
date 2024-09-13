import { filterCollectionProductsBySize, getCollections } from '../../../utils.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { size } = await request.json();
	const res = await getCollections();
	const collections =
		res?.data?.collections?.edges?.map((collection) => collection.node.handle) || [];

	let allFilteredProducts = [];
	let results;
	if (collections.length > 0 && size != null) {
		const promises = collections.map(async (collection) => {
			const res = await filterCollectionProductsBySize(collection, size);
			return res?.data?.collection?.products || [];
		});

		results = await Promise.all(promises);
	}
	results
		?.filter((result) => result.nodes.length > 0)
		?.forEach((result) => {
			allFilteredProducts = [...allFilteredProducts, ...result.nodes];
		});

	return json(allFilteredProducts);
}
