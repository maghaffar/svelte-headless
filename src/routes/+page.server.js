import {
	getCollections,
	getHome,
	getBgImagesWithText,
	getBlogs,
	getCollectionProducts
} from '../utils';
export async function load({}) {
	const collections = await getCollections();
	const home = await getHome();
	const {
		data: {
			homeCollection: { items }
		}
	} = home;
	const bgImagesWithText = await getBgImagesWithText();
	const {
		data: {
			bgImagesWithTextCollection: { items: bgCollectionItems }
		}
	} = bgImagesWithText;

	const featuredImage = items[0].featuredImage;
	const featuredImageMobile = items[0].featuredImageMobile;
	const imageText = items[0].title;
	const imageDescription = items[0].description;
	const {
		data: {
			collections: { edges }
		}
	} = collections;
	// Feartured Blogs
	const res = await getBlogs();
	const blogs = res.data?.blogs?.nodes;
	const articles = [];
	blogs.map((blog) => {
		blog.articles?.nodes.map((article) => {
			articles.push(article);
		});
	});
	// Collection Products
	const ress = await getCollectionProducts('men');
	const {
		data: {
			collection: { products: formalCollectionProducts }
		}
	} = ress;
	// Sale Collection
	const sale = await getCollectionProducts('sale');
	const {
		data: {
			collection: { products: saleCollectionProducts }
		}
	} = sale;
	// Sale Collection
	const kids = await getCollectionProducts('kid');
	const {
		data: {
			collection: { products: kidsCollectionProducts }
		}
	} = kids;
	return {
		edges,
		featuredImage,
		featuredImageMobile,
		formalCollectionProducts: formalCollectionProducts.nodes,
		saleCollectionProducts: saleCollectionProducts.nodes,
		kidsCollectionProducts: kidsCollectionProducts.nodes,
		articles,
		imageText,
		imageDescription,
		bgCollectionItems
	};
}
