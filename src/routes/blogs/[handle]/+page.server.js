import { getBlog } from '../../../utils';

export async function load({ params }) {
	const res = await getBlog(params.handle);
	const {
		data: { blog }
	} = res;
	const {
		data: {
			blog: { articles }
		}
	} = res;
	return {
		articles,
		blog
	};
}
