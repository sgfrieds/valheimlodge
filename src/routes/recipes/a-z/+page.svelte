<script lang="ts">
	import { recipes } from '$lib/data/recipes';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import RecipeBrowseNav from '$lib/components/RecipeBrowseNav.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { Hash } from '@lucide/svelte';

	// Sort recipes alphabetically and group by first letter
	const sortedRecipes = [...recipes].sort((a, b) => 
		a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
	);

	// Group by first letter
	const groupedRecipes = $derived(() => {
		const groups = new Map<string, typeof recipes>();
		
		for (const recipe of sortedRecipes) {
			const firstChar = recipe.title.charAt(0).toUpperCase();
			// Group numbers and special characters under #
			const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
			
			if (!groups.has(letter)) {
				groups.set(letter, []);
			}
			groups.get(letter)!.push(recipe);
		}
		
		// Convert to sorted array
		return Array.from(groups.entries()).sort((a, b) => {
			if (a[0] === '#') return -1;
			if (b[0] === '#') return 1;
			return a[0].localeCompare(b[0]);
		});
	});

	// Get list of available letters for quick nav
	const availableLetters = $derived(groupedRecipes().map(([letter]) => letter));

	function scrollToLetter(letter: string) {
		const element = document.getElementById(`letter-${letter}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<svelte:head>
	<title>A-Z Recipe Index - Valheim Lodge</title>
	<meta name="description" content="Browse all recipes alphabetically from the Valheim Lodge cookbook" />
</svelte:head>

<div class="space-y-8">
	<Breadcrumb items={[{ label: 'Recipes', href: '/recipes' }, { label: 'A-Z Index' }]} />

	<header class="text-center space-y-4">
		<h1 class="h1">A-Z Recipe Index</h1>
		<p class="text-surface-600-400">Browse all recipes alphabetically</p>
		<p class="text-sm text-surface-500">{recipes.length} recipes in our collection</p>
	</header>

	<!-- Browse Navigation -->
	<RecipeBrowseNav />

	<!-- Alphabet Quick Nav -->
	<nav class="sticky top-0 z-10 bg-surface-50-900 py-3 border-b border-surface-200-700" aria-label="Jump to letter">
		<div class="flex flex-wrap justify-center gap-1">
			{#each 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as letter}
				{@const isAvailable = availableLetters.includes(letter)}
				<button
					onclick={() => scrollToLetter(letter)}
					disabled={!isAvailable}
					class="w-8 h-8 text-sm font-medium rounded transition-colors
						{isAvailable 
							? 'preset-filled-primary-500 hover:brightness-110' 
							: 'bg-surface-200-700 text-surface-400 cursor-not-allowed'}"
					aria-label="Jump to recipes starting with {letter}"
				>
					{letter}
				</button>
			{/each}
			{#if availableLetters.includes('#')}
				<button
					onclick={() => scrollToLetter('#')}
					class="w-8 h-8 text-sm font-medium rounded preset-filled-primary-500 hover:brightness-110 transition-colors"
					aria-label="Jump to recipes starting with numbers or symbols"
				>
					<Hash class="w-4 h-4 mx-auto" />
				</button>
			{/if}
		</div>
	</nav>

	<!-- Recipe Groups -->
	<div class="space-y-8">
		{#each groupedRecipes() as [letter, letterRecipes]}
			<section id="letter-{letter}" class="scroll-mt-20">
				<h2 class="h2 mb-4 pb-2 border-b border-surface-300-600 flex items-center gap-2">
					{#if letter === '#'}
						<Hash class="w-6 h-6" />
					{:else}
						{letter}
					{/if}
					<span class="text-sm font-normal text-surface-500">
						({letterRecipes.length} recipe{letterRecipes.length !== 1 ? 's' : ''})
					</span>
				</h2>
				
				<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each letterRecipes as recipe}
						<li>
							<RecipeCard {recipe} compact />
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>
