import { getBlog } from '../../../../utils.js';
export async function load({ params }) {
	const res = await getBlog(params.blogHandle);
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
		article
	};
}
