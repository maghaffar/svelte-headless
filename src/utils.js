import axios from 'axios';
import { PUBLIC_STOREFRONT_API_TOKEN } from '$env/static/public';

export async function getProducts() {
	const query = ` {
		products(first: 50) {
		  edges {
			node {
			  id
			  title
			  featuredImage{
				url
			  }
			  handle
			   priceRange{
			maxVariantPrice{
			  amount
			  }
		    }
			  media(first:5) {
			  nodes {
			  previewImage {
				url
			  }
			}
		  }
			  }
		  }
	  }
  }`;

	const data = JSON.stringify({
		query
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getProduct(handle) {
	const query = ` query getProductByHandle($handle: String) {
		product(handle: $handle) {
		  id
		  title
		  description
		  metafields(identifiers:[{namespace:"custom",key:"products"},{namespace:"custom",key:"collection"}]){
			id
			key
			value
		  }
		  metafield(namespace:"custom", key:"color"){
			id
			key
			value
		  }
		  featuredImage{
			url
		  }
		  media(first:5) {
			nodes {
			  previewImage {
				url
			  }
			}
		  }
		  vendor
		  priceRange{
			maxVariantPrice{
			  amount
			}
		  }
		  variants(first:5){
			nodes{
			  id
			  title
			  availableForSale
			  selectedOptions{
				name
				value
			  }
			  image{
				url
			  }
			}
		  }
		}
	  }`;
	const variables = {
		handle
	};

	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		timeout: 15000,
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function searchProducts(q) {
	const query = `
	query suggestions($q: String!) {
  predictiveSearch(query: $q, limit: 6, limitScope: EACH) {
    collections {
      id
      handle
      title
    }
    products {
      id
      title
      featuredImage {
        url
      }
      handle
      priceRange {
        maxVariantPrice {
          amount
        }
      }
    }
  }
}
`;

	const variables = {
		q
	};
	const data = JSON.stringify({
		query,
		variables
	});

	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}
export async function getProductById(id) {
	const query = ` query getProductByHandle($id: ID) {
		product(id: $id) {
		  id
		  title
		  description
		  handle
		  metafields(identifiers:{namespace:"custom",key:"products"}){
			id
			key
			value
		  }
		  featuredImage{
			url
		  }
		  media(first:5) {
			nodes {
			  previewImage {
				url
			  }
			}
		  }
		  vendor
		  priceRange{
			maxVariantPrice{
			  amount
			}
		  }
		  variants(first:5){
			nodes{
			  id
			  title
			  selectedOptions{
				name
				value
			  }
			  image{
				url
			  }
			}
		  }
		}
	  }`;
	const variables = {
		id
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function createCart() {
	const query = ` mutation cartCreate {
		cartCreate {
		  cart {
			id
		  }
		}
	  }`;
	const data = JSON.stringify({
		query
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function cartLinesAdd(cartId, merchandiseId, quantity) {
	const query = ` mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
		cartLinesAdd(cartId: $cartId, lines: $lines) {
		  cart {
			id
			cost {
				totalAmount {
				  amount
				}
			  }
			  createdAt
			  lines(first:5) {
				nodes {
				  merchandise {
					__typename
				  }
				  quantity
				}
			  }
			  totalQuantity
		  }
		  userErrors {
			field
			message
		  }
		}
	  }`;
	const variables = {
		cartId: cartId,
		lines: [
			{
				merchandiseId: merchandiseId,
				quantity: quantity
			}
		]
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}
export async function cartLinesUpdate(cartId, merchandiseId, quantity) {
	const query = ` mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
		cartLinesUpdate(cartId: $cartId, lines: $lines) {
		  cart {
			id
			cost {
				totalAmount {
				  amount
				}
			  }
			  createdAt
			  lines(first:5) {
				nodes {
				  merchandise {
					__typename
				  }
				  quantity
				}
			  }
			  totalQuantity
		  }
		  userErrors {
			field
			message
		  }
		}
	  }`;
	const variables = {
		cartId: cartId,
		lines: [
			{
				id: merchandiseId,
				quantity: quantity
			}
		]
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function cartDiscountCodesUpdate(cartId, discountCode) {
	const query = ` mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
		cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
		  cart {
		  id
		  checkoutUrl
		  totalQuantity
		  discountCodes {
			code
			applicable
		  }
		  discountAllocations {
            discountedAmount {
             amount
           }
           }
		  
		  cost{
			totalAmount{
			  amount
			}
			subtotalAmount{
			  amount
			}
		  }
		  lines(first: 20) {
			edges {
			  node {
				id
				merchandise {
				  __typename
				  ... on ProductVariant {
					id
					image {
					  url
					}
					product {
					  id
					  handle
					  title
					  vendor
					}
					price {
					  amount
					}
					selectedOptions {
					  name
					  value
					}
				  }
				}
				quantity
				cost {
				  amountPerQuantity {
					amount
				  }
				  totalAmount {
					amount
				  }
				}
				attributes {
				  key
				  value
				}
			  }
			}
		  }
		}
	  }
}`;
	const variables = {
		cartId: cartId,
		discountCodes: [discountCode]
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function cartNoteUpdate(cartId, note) {
	const query = ` mutation cartNoteUpdate($cartId: ID!, $note: String) {
		cartNoteUpdate(cartId: $cartId, note: $note) {
		  cart {
			id
			note
		  }
		}
	  }`;

	const variables = {
		cartId,
		note
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getCollections() {
	const query = `{
		collections(first: 4) {
		  edges {
			node {
			  id
			  handle
			  description
			  title
			  image {
				url
			  }
			 
			}
		  }
		}
	  }`;
	const data = JSON.stringify({
		query
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getCollectionProducts(handle) {
	const query = `query getCollectionProducts($handle: String) {
		collection(handle: $handle) {
		  title
		  products(first: 10) {
			nodes {
			  id
			  handle
			  description
			  title
			  vendor
			  priceRange {
				maxVariantPrice {
				  amount
				}
			  }
			  media(first: 5) {
				nodes {
				  previewImage {
					url
				  }
				}
			  }
			  variants(first: 5) {
				nodes {
				  id
				  title
				  selectedOptions {
					name
					value
				  }
				  image {
					url
				  }
				}
			  }
			  featuredImage {
				url
			  }
			}
		  }
		}
	  }
	  `;
	const variables = {
		handle
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getBlogs() {
	const query = `query {
		blogs(first: 10) {
			nodes {
			  handle
			  title
			  articles(first: 50) {
				nodes {
				  handle
				  id
				  title
				  blog {
					title
					handle
				  }
				  excerpt
				  content
				  contentHtml
				  image {
					url
				  }
				}
			  }
			}
		  }
	}
	  `;
	const data = JSON.stringify({
		query
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getBlog(handle) {
	const query = `query getBlog($handle: String) {
		blog(handle: $handle) {
			id
			handle
			title
			onlineStoreUrl
			authors {
			  name
			}
			articles(first: 50) {
			  nodes {
				handle
				id
				title
				blog {
				  title
				  handle
				}
				excerpt
				content
				contentHtml
				image {
				  url
				}
			  }
			}
		  }
	  }
	  `;
	const variables = {
		handle
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getArticle(id) {
	const query = `query getArticle($id: ID!) {
		article(id:$id){
			title
			handle
			excerpt
			contentHtml
			image{
			  url
			}
		  }
	  }
	  `;
	const variables = {
		id
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getCartQuantity(id) {
	const query = `query getQuantity($id: ID!){
		cart(id: $id) {
		  totalQuantity
	  }
	}
	  `;
	const variables = {
		id
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getCartLines(id) {
	const query = `query getCartLines($id: ID!) {
		cart(id: $id) {
		  id
		  checkoutUrl
		  totalQuantity
		  note
		  discountCodes{
				code
				applicable
		  }
		  discountAllocations {
            discountedAmount {
             amount
           }
           }
		  cost{
			totalAmount{
			  amount
			}
			subtotalAmount{
			  amount
			}
		  }
		  lines(first: 20) {
			edges {
			  node {
				id
				merchandise {
				  __typename
				  ... on ProductVariant {
					id
					image {
					  url
					}
					product {
					  id
					  handle
					  title
					  vendor
					}
					price {
					  amount
					}
					selectedOptions {
					  name
					  value
					}
				  }
				}
				quantity
				cost {
				  amountPerQuantity {
					amount
				  }
				  totalAmount {
					amount
				  }
				}
				attributes {
				  key
				  value
				}
			  }
			}
		  }
		}
	  }
	  
	  `;
	const variables = {
		id
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function cartLinesRemove(cartId, lineIds) {
	const query = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
		cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
		  cart {
			id
		  }
		  userErrors {
			field
			message
		  }
		}
	  }`;
	const variables = {
		cartId,
		lineIds
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}
export async function getCollectionProductsById(id) {
	const query = `query getCollectionProducts($id: ID) {
		collection(id: $id) {
		  title
		  products(first: 10) {
			nodes {
			  handle
			  title
			  priceRange {
				maxVariantPrice {
				  amount
				}
			  }
			  featuredImage {
				url
			  }
			}
		  }
		}
	  }
	  `;
	const variables = {
		id
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);

		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getHome() {
	const query = `{
	homeCollection {
	  items {
		title
		description
		featuredImage {
		  url
		}
	  }
	}
  }`;
	let data = JSON.stringify({
		query
	});

	let config = {
		method: 'post',
		url: 'https://graphql.contentful.com/content/v1/spaces/f5irrz67l1d1/environments/master',
		headers: {
			'Accept-Encoding': 'gzip, deflate, br',
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Connection: 'keep-alive',
			DNT: '1',
			Origin: 'https://033bad1b-c8e2-4ee5-b8f8-f4c19c33ca37.ctfcloud.net',
			Authorization: 'Bearer RfBbLZQ-T2xQ6wKRpsvHN-1ReEg8LRcKptJJRXk24q0'
		},
		data: data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (err) {
		console.error(err);
	}
}
export async function customerCreate(firstName, lastName, email, password) {
	const query = `mutation customerCreate($input: CustomerCreateInput!) {
		customerCreate(input: $input) {
		  customerUserErrors {
			code
			field
			message
		  }
		  customer {
			firstName
      		lastName
      		email
		  }
		}
	  }`;
	const variables = {
		input: {
			firstName,
			lastName,
			email,
			password
		}
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2022-07/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}
export async function customerAccessTokenCreate(email, password) {
	const query = `mutation customerAccessTokenCreate($email: String!, $password: String!) {
		customerAccessTokenCreate(input: {email: $email, password: $password}) {
		  customerUserErrors {
			code
			field
			message
		  }
		  customerAccessToken {
			accessToken
			expiresAt
		  }
		}
	  }`;
	const variables = {
		email,
		password
	};
	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2022-07/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getCustomer(accessToken) {
	const query = `query customer($accessToken: String!) {
		customer(customerAccessToken: $accessToken) {
		  firstName
		  lastName
		  displayName
		  email
		  numberOfOrders
		}
	}
	  `;
	const variables = {
		accessToken
	};

	const data = JSON.stringify({
		query,
		variables
	});
	const config = {
		method: 'POST',
		url: 'https://ag-ins-test-store.myshopify.com/api/2024-01/graphql.json',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PUBLIC_STOREFRONT_API_TOKEN,
			Connection: 'keep-alive'
		},
		data
	};

	try {
		const res = await axios.request(config);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export async function getMegaMenu(client) {
	try {
		const entries = await client.getEntries({
			content_type: 'megaMenu'
		});
		return entries?.items[0]?.fields?.menuItem;
	} catch (err) {
		console.error(err);
	}
}

export async function getColumn(id, client) {
	try {
		const column = await client.getEntry(id);
		return column?.fields;
	} catch (err) {
		console.error(err);
	}
}
