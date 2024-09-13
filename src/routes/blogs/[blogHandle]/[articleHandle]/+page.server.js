import { getBlog, getPopularArticles, getCollectionProducts } from '../../../../utils.js';
export async function load({ params }) {
	const res = await getBlog(params.blogHandle);
	const response = await getPopularArticles();
	const resCollectionProducts = await getCollectionProducts('sale');
	const {
		data: {
			collection: { products: collectionProducts }
		}
	} = resCollectionProducts;
	const {
		data: {
			articles: { nodes: popularArticles }
		}
	} = response;
	const {
		data: {
			blog: { articles }
		}
	} = await res;
	let article = {};
	articles?.nodes.map((a) => {
		if (a.handle == params.articleHandle) {
			article = a;
		}
	});
	return {
		article,
		popularArticles,
		collectionProducts
	};
}
