import { getColumn, getMegaMenu, getCartLines, createCart, getCustomHeader } from '../utils';
import contentful from 'contentful';
import { PUBLIC_CONTENTFUL_ACCESS_TOKEN } from '$env/static/public';
import { PUBLIC_CONTENTFUL_SPACE_ID } from '$env/static/public';

export async function load({ cookies }) {
	let cartId = cookies.get('cart-id');
	if (!cartId) {
		const cart = await createCart();
		const {
			data: {
				cartCreate: {
					cart: { id: cartid }
				}
			}
		} = await cart;
		cartId = cartid;
		cookies.set('cart-id', cartid, { path: '/', maxAge: 86400 });
	}
	const client = contentful.createClient({
		space: PUBLIC_CONTENTFUL_SPACE_ID,
		accessToken: PUBLIC_CONTENTFUL_ACCESS_TOKEN
	});
	const menuItem = await getMegaMenu(client);
	const items = menuItem.map(async (item) => {
		const title = item.fields.title;
		const collectionUrl = item.fields.collectionUrl;
		const promises = item.fields.column.map(async (col) => {
			const fields = await getColumn(col.sys.id, client);
			return fields;
		});
		const columns = await Promise.all(promises);
		return { title, columns, collectionUrl };
	});

	const menuItems = await Promise.all(items);

	menuItems.map((menuItem) => {
		const columns = menuItem.columns;
		const menu = columns.map((col) => {
			const title = col.columnTitle;
			const fields = col?.item?.map((item) => {
				return item?.fields;
			});
			return { title, fields };
		});
		menuItem.columns = menu;
	});

	const res = await getCartLines(cartId);
	const { data: { cart = {} } = {} } = res;

	const customHeaderRes = await getCustomHeader();
	const {
		data: {
			customHeader: {
				headerBlockCollection: { items: customHeaderItems }
			}
		}
	} = customHeaderRes;

	return {
		menuItems,
		cart,
		cartId,
		customHeaderItems
	};
}
