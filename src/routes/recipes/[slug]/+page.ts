import { getRecipeBySlug, getAllCategories } from '$lib/data/recipes';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const recipe = getRecipeBySlug(params.slug);

	if (!recipe) {
		error(404, `Recipe not found`);
	}

	return {
		recipe,
		allCategories: getAllCategories()
	};
};
