import { pstore } from '../../stores/PuzzleStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	console.log({ params });
	await pstore.getPuzzle(new Date(params.date), fetch);
	return {};
};
