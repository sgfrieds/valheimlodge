<script lang="ts">
	import { recipes, getAllCategories, filterRecipes, getSectionDisplayName } from '$lib/data/recipes';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import RecipeBrowseNav from '$lib/components/RecipeBrowseNav.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';

	// Get filter options
	const categories = getAllCategories();
	const sections = ['Norwegian', 'Non-Norwegian'] as const;

	// Filter state - derived from URL params
	const searchQuery = $derived($page.url.searchParams.get('q') || '');
	const selectedSection = $derived(
		($page.url.searchParams.get('section') as 'Norwegian' | 'Non-Norwegian' | '') || ''
	);
	const selectedCategory = $derived($page.url.searchParams.get('category') || '');

	// Update URL when filters change
	function updateFilters(updates: { q?: string; section?: string; category?: string }) {
		if (!browser) return;
		
		const url = new URL($page.url);
		
		for (const [key, value] of Object.entries(updates)) {
			if (value) {
				url.searchParams.set(key, value);
			} else {
				url.searchParams.delete(key);
			}
		}
		
		goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
	}

	// Filtered recipes
	const filteredRecipes = $derived(
		filterRecipes({
			section: selectedSection || undefined,
			category: selectedCategory || undefined,
			searchQuery: searchQuery || undefined
		})
	);

	// Group filtered recipes by section and category
	const groupedRecipes = $derived(() => {
		const sectionMap = new Map<string, Map<string, typeof recipes>>();

		for (const recipe of filteredRecipes) {
			if (!sectionMap.has(recipe.section)) {
				sectionMap.set(recipe.section, new Map());
			}
			const categoryMap = sectionMap.get(recipe.section)!;
			if (!categoryMap.has(recipe.category)) {
				categoryMap.set(recipe.category, []);
			}
			categoryMap.get(recipe.category)!.push(recipe);
		}

		return sectionMap;
	});

	// Check if any filters are active
	const hasActiveFilters = $derived(searchQuery || selectedSection || selectedCategory);

	function clearFilters() {
		if (!browser) return;
		goto('/recipes', { replaceState: true, keepFocus: true, noScroll: true });
	}

	// Build dynamic breadcrumb items based on active filters
	const breadcrumbItems = $derived(() => {
		const items: { label: string; href?: string }[] = [{ label: 'Recipes', href: hasActiveFilters ? '/recipes' : undefined }];
		
		if (selectedSection) {
			const sectionUrl = `/recipes?section=${encodeURIComponent(selectedSection)}`;
			items.push({ 
				label: getSectionDisplayName(selectedSection), 
				href: selectedCategory || searchQuery ? sectionUrl : undefined 
			});
		}
		
		if (selectedCategory) {
			const categoryUrl = selectedSection 
				? `/recipes?section=${encodeURIComponent(selectedSection)}&category=${encodeURIComponent(selectedCategory)}`
				: `/recipes?category=${encodeURIComponent(selectedCategory)}`;
			items.push({ 
				label: selectedCategory, 
				href: searchQuery ? categoryUrl : undefined 
			});
		}
		
		if (searchQuery) {
			items.push({ label: `"${searchQuery}"` });
		}
		
		return items;
	});
</script>

<svelte:head>
	<title>{hasActiveFilters ? `${filteredRecipes.length} results` : 'Recipes'} - Valheim Lodge</title>
	<meta name="description" content="Norwegian-American recipes from the Valheim Lodge cookbook" />
</svelte:head>

<div class="space-y-8">
	<Breadcrumb items={breadcrumbItems()} />

	<header class="text-center space-y-4">
		<h1 class="h1">Recipes</h1>
		<p class="text-surface-600-400">Norwegian-American recipes from our cookbook</p>
		<p class="text-sm text-surface-500">{recipes.length} recipes in our collection</p>
	</header>

	<!-- Browse Navigation -->
	<RecipeBrowseNav />

	<!-- Search and Filter Controls -->
	<div class="card preset-filled-surface-100-900 p-6 space-y-4">
		<div class="grid gap-4 md:grid-cols-4">
			<!-- Search -->
			<div class="md:col-span-2">
				<label for="search" class="label mb-2 block">Search recipes</label>
				<input
					type="search"
					id="search"
					value={searchQuery}
					oninput={(e) => updateFilters({ q: e.currentTarget.value })}
					placeholder="Search by name, contributor, or ingredient..."
					class="input w-full"
				/>
			</div>

			<!-- Section Filter -->
			<div>
				<label for="section" class="label mb-2 block">Section</label>
				<select 
					id="section" 
					value={selectedSection} 
					onchange={(e) => updateFilters({ section: e.currentTarget.value })}
					class="select w-full"
				>
					<option value="">All Sections</option>
					{#each sections as section}
						<option value={section}>{getSectionDisplayName(section)}</option>
					{/each}
				</select>
			</div>

			<!-- Category Filter -->
			<div>
				<label for="category" class="label mb-2 block">Category</label>
				<select 
					id="category" 
					value={selectedCategory}
					onchange={(e) => updateFilters({ category: e.currentTarget.value })}
					class="select w-full"
				>
					<option value="">All Categories</option>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Results count and clear filters -->
		<div class="flex justify-between items-center pt-2 border-t border-surface-300-700">
			<p class="text-sm text-surface-600-400">
				Showing {filteredRecipes.length} of {recipes.length} recipes
			</p>
			{#if hasActiveFilters}
				<button onclick={clearFilters} class="btn btn-sm preset-outlined-primary-500">
					Clear Filters
				</button>
			{/if}
		</div>
	</div>

	<!-- Recipe Results -->
	{#if filteredRecipes.length === 0}
		<div class="text-center py-12">
			<p class="h3 text-surface-500">No recipes found</p>
			<p class="text-surface-600-400 mt-2">Try adjusting your search or filters</p>
		</div>
	{:else}
		{#each [...groupedRecipes().entries()] as [section, categoryMap]}
			<div class="space-y-6">
				<h2 class="h2 text-center border-b-2 border-primary-500 pb-2">{getSectionDisplayName(section)} Recipes</h2>
				
				{#each [...categoryMap.entries()].sort((a, b) => a[0].localeCompare(b[0])) as [categoryName, categoryRecipes]}
					<section class="space-y-4">
						<h3 class="h3">{categoryName} <span class="text-surface-500 text-lg">({categoryRecipes.length})</span></h3>
						<ul class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
							{#each categoryRecipes as recipe}
								<li>
									<RecipeCard {recipe} showCategory={false} showServings />
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		{/each}
	{/if}
</div>
