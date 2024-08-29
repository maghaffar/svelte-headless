import { getProduct, getProductById, getCollectionProductsById } from '../../../utils.js';
import { error } from '@sveltejs/kit';
export async function load({ params }) {
	const product = await getProduct(params.handle);
	const metafield = product?.data?.product.metafield;
	const metafields = product?.data?.product.metafields;

	let ids = [];
	ids = metafields[0] !== null ? JSON.parse(metafields[0]?.value) : [];
	let swatches = [];
	for (let i = 0; i < ids.length; i++) {
		const product = await getProductById(ids[i]);
		product && swatches.push(product);
	}
	const productId = metafield?.value;
	let collectionId = metafields[1] !== null ? metafields[1].value : '';
	let collectionProducts;
	if (collectionId) {
		collectionProducts = await getCollectionProductsById(collectionId);
	}

	let collection;
	if (collectionProducts) {
		collection = collectionProducts.data.collection.products;
	}

	let relatedProduct;
	if (productId) {
		relatedProduct = await getProductById(productId);
	}
	if (!product && !relatedProduct) {
		throw error(500, 'Something went wrong');
	}

	return {
		product,
		relatedProduct,
		swatches,
		collection
	};
}
