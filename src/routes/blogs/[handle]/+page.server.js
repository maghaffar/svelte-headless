import { getBlog, getBlogsList, getPopularArticles, getCollectionProducts } from '../../../utils';

export async function load({ params }) {
	const res = await getBlog(params.handle);
	const resp = await getBlogsList();
	const response = await getPopularArticles();
	const resCollectionProducts = await getCollectionProducts('new-arrivals');
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
			blogs: { nodes }
		}
	} = resp;
	const {
		data: { blog }
	} = res;
	const {
		data: {
			blog: { articles }
		}
	} = res;
	return {
		blogs: nodes,
		articles,
		blog,
		popularArticles,
		collectionProducts
	};
}
