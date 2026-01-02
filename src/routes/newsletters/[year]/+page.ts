import { getNewslettersByYear, getAllYears } from '$lib/data/newsletters';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const year = parseInt(params.year);

	if (isNaN(year)) {
		error(400, 'Invalid year');
	}

	const yearData = getNewslettersByYear(year);

	if (!yearData) {
		error(404, `No newsletters found for ${year}`);
	}

	return {
		year,
		newsletters: yearData.newsletters,
		allYears: getAllYears()
	};
};
