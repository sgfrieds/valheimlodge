export interface Ingredient {
	amount?: string;
	unit?: string;
	item: string;
	note?: string;
}

export interface Recipe {
	slug: string;
	title: string;
	contributor: string;
	category: string;
	section: 'Norwegian' | 'Non-Norwegian';
	servings?: string;
	ingredients: Ingredient[];
	instructions: string[];
}

export interface RecipeCategory {
	name: string;
	slug: string;
	recipes: Recipe[];
}

// Display names for sections (data uses short names for backwards compatibility)
export const sectionDisplayNames: Record<string, string> = {
	Norwegian: 'Norwegian-American',
	'Non-Norwegian': 'Non-Norwegian'
};

export function getSectionDisplayName(section: string): string {
	return sectionDisplayNames[section] || section;
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

import recipesData from './recipes.json';

export const recipes: Recipe[] = recipesData as Recipe[];

/**
 * Get all recipes grouped by category
 */
export function getRecipesByCategory(): RecipeCategory[] {
	const categoryMap = new Map<string, Recipe[]>();

	for (const recipe of recipes) {
		const existing = categoryMap.get(recipe.category) || [];
		existing.push(recipe);
		categoryMap.set(recipe.category, existing);
	}

	return Array.from(categoryMap.entries())
		.map(([name, recipes]) => ({
			name,
			slug: slugify(name),
			recipes
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single recipe by slug
 */
export function getRecipeBySlug(slug: string): Recipe | undefined {
	return recipes.find((r) => r.slug === slug);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
	return [...new Set(recipes.map((r) => r.category))].sort();
}

/**
 * Get all recipes grouped by section, then by category
 */
export function getRecipesBySection(): Map<string, RecipeCategory[]> {
	const sectionMap = new Map<string, RecipeCategory[]>();

	for (const section of ['Norwegian', 'Non-Norwegian'] as const) {
		const sectionRecipes = recipes.filter((r) => r.section === section);
		const categoryMap = new Map<string, Recipe[]>();

		for (const recipe of sectionRecipes) {
			const existing = categoryMap.get(recipe.category) || [];
			existing.push(recipe);
			categoryMap.set(recipe.category, existing);
		}

		const categories = Array.from(categoryMap.entries())
			.map(([name, recipes]) => ({
				name,
				slug: slugify(name),
				recipes
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		sectionMap.set(section, categories);
	}

	return sectionMap;
}

/**
 * Get all unique contributors with their recipes
 */
export function getAllContributors(): { name: string; slug: string; recipes: Recipe[] }[] {
	const contributorMap = new Map<string, Recipe[]>();

	for (const recipe of recipes) {
		const existing = contributorMap.get(recipe.contributor) || [];
		existing.push(recipe);
		contributorMap.set(recipe.contributor, existing);
	}

	return Array.from(contributorMap.entries())
		.map(([name, recipes]) => ({
			name,
			slug: slugify(name),
			recipes
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get related recipes (same category, excluding current recipe)
 */
export function getRelatedRecipes(recipe: Recipe, limit: number = 4): Recipe[] {
	const sameCategory = recipes.filter(
		(r) => r.category === recipe.category && r.slug !== recipe.slug
	);

	// Shuffle and take limited number
	const shuffled = sameCategory.sort(() => Math.random() - 0.5);
	return shuffled.slice(0, limit);
}

/**
 * Search recipes by title, contributor, or category
 */
export function searchRecipes(query: string): Recipe[] {
	const lowerQuery = query.toLowerCase().trim();
	if (!lowerQuery) return recipes;

	return recipes.filter(
		(r) =>
			r.title.toLowerCase().includes(lowerQuery) ||
			r.contributor.toLowerCase().includes(lowerQuery) ||
			r.category.toLowerCase().includes(lowerQuery) ||
			r.ingredients.some((i) => i.item.toLowerCase().includes(lowerQuery))
	);
}

/**
 * Filter recipes by multiple criteria
 */
export function filterRecipes(options: {
	section?: 'Norwegian' | 'Non-Norwegian';
	category?: string;
	contributor?: string;
	searchQuery?: string;
}): Recipe[] {
	let filtered = recipes;

	if (options.section) {
		filtered = filtered.filter((r) => r.section === options.section);
	}

	if (options.category) {
		filtered = filtered.filter((r) => r.category === options.category);
	}

	if (options.contributor) {
		filtered = filtered.filter((r) => r.contributor === options.contributor);
	}

	if (options.searchQuery) {
		const query = options.searchQuery.toLowerCase().trim();
		filtered = filtered.filter(
			(r) =>
				r.title.toLowerCase().includes(query) ||
				r.contributor.toLowerCase().includes(query) ||
				r.ingredients.some((i) => i.item.toLowerCase().includes(query))
		);
	}

	return filtered;
}
