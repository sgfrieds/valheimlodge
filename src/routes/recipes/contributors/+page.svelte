<script lang="ts">
	import { getAllContributors, recipes } from '$lib/data/recipes';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import RecipeBrowseNav from '$lib/components/RecipeBrowseNav.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';

	const contributors = getAllContributors();
</script>

<svelte:head>
	<title>Recipe Contributors - Valheim Lodge</title>
	<meta name="description" content="Browse recipes by contributor from the Valheim Lodge cookbook" />
</svelte:head>

<div class="space-y-8">
	<Breadcrumb items={[{ label: 'Recipes', href: '/recipes' }, { label: 'Contributors' }]} />

	<header class="text-center space-y-4">
		<h1 class="h1">Recipe Contributors</h1>
		<p class="text-surface-600-400">Thank you to all who shared their cherished family recipes</p>
		<p class="text-sm text-surface-500">{contributors.length} contributors • {recipes.length} recipes</p>
	</header>

	<!-- Browse Navigation -->
	<RecipeBrowseNav />

	<div class="space-y-6">
		{#each contributors as contributor}
			<section class="card preset-filled-surface-100-900 p-6 space-y-4">
				<header class="flex justify-between items-center">
					<h2 class="h3">{contributor.name}</h2>
					<span class="badge preset-filled-primary-500">
						{contributor.recipes.length} recipe{contributor.recipes.length !== 1 ? 's' : ''}
					</span>
				</header>
				
				<ul class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
					{#each contributor.recipes as recipe}
						<li>
							<RecipeCard {recipe} showContributor={false} compact />
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>
