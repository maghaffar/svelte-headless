import { getBlogs } from '../../../utils';
export async function load() {
	const res = await getBlogs();
	const blogs = res.data?.blogs?.nodes;
	return {
		blogs
	};
}
