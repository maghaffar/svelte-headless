import { getCollections, getHome, getProducts, getBlogs } from '../utils';
export async function load({}) {
	const collections = await getCollections();
	const home = await getHome();
	const {
		data: {
			homeCollection: { items }
		}
	} = home;
	const featuredImage = items[0].featuredImage;
	const imageText = items[0].title;
	const imageDescription = items[0].description;
	const {
		data: {
			collections: { edges }
		}
	} = collections;

	// Feartured Products
	let {
		data: {
			products: { edges: products }
		}
	} = await getProducts();
	// Feartured Blogs
	const res = await getBlogs();
	const blogs = res.data?.blogs?.nodes;
	const articles = [];
	blogs.map((blog) => {
		blog.articles?.nodes.map((article) => {
			articles.push(article);
		});
	});
	return {
		edges,
		featuredImage,
		products,
		articles,
		imageText,
		imageDescription
	};
}
