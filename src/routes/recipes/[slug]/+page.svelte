<script lang="ts">
	import { getRelatedRecipes, getSectionDisplayName } from '$lib/data/recipes';
	import { Printer, Calculator, Plus, Minus, RotateCcw } from '@lucide/svelte';
	import { scaleAmount, parseServings, formatServings } from '$lib/utils/scaling';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const relatedRecipes = $derived(getRelatedRecipes(data.recipe, 4));

	// Scaling state
	const originalServings = $derived(parseServings(data.recipe.servings || ''));
	let scalingEnabled = $state(false);
	let customServings = $state(4);
	let customMultiplier = $state(1); // For recipes without servings

	// Preset multipliers for quick selection
	const multiplierPresets = [0.25, 0.5, 1, 1.5, 2, 3];

	// Initialize when recipe changes
	$effect(() => {
		const parsed = parseServings(data.recipe.servings || '');
		customServings = parsed?.value ?? 4;
		customMultiplier = 1;
		scalingEnabled = false;
	});
	
	// Calculate multiplier based on mode
	const multiplier = $derived(() => {
		if (!scalingEnabled) return 1;
		if (originalServings) {
			return customServings / originalServings.value;
		}
		return customMultiplier;
	});

	// Scaled ingredients
	const scaledIngredients = $derived(
		data.recipe.ingredients.map((ing) => ({
			...ing,
			scaledAmount: ing.amount ? scaleAmount(ing.amount, multiplier()) : undefined
		}))
	);

	// Scaled servings display
	const scaledServingsDisplay = $derived(
		data.recipe.servings ? formatServings(data.recipe.servings, multiplier()) : ''
	);

	function printRecipe() {
		window.print();
	}

	function incrementServings() {
		customServings = Math.min(customServings + 1, 100);
		updateMultiplierFromServings();
	}

	function decrementServings() {
		customServings = Math.max(customServings - 1, 1);
		updateMultiplierFromServings();
	}

	function updateMultiplierFromServings() {
		if (originalServings) {
			const currentMultiplier = customServings / originalServings.value;
			// Round to 2 decimal places for comparison
			const roundedMultiplier = Math.round(currentMultiplier * 100) / 100;
			
			// Check if it matches any preset
			const matchingPreset = multiplierPresets.find(
				preset => Math.abs(preset - roundedMultiplier) < 0.01
			);
			
			if (matchingPreset !== undefined) {
				customMultiplier = matchingPreset;
			} else {
				// Set to a value that won't match any preset
				customMultiplier = roundedMultiplier;
			}
		}
	}

	function resetScale() {
		if (originalServings) {
			customServings = originalServings.value;
		} else {
			customMultiplier = 1;
		}
		updateMultiplierFromServings();
	}

	function toggleScaling() {
		scalingEnabled = !scalingEnabled;
		if (scalingEnabled && originalServings) {
			customServings = originalServings.value;
		}
	}

	function setMultiplier(value: number) {
		customMultiplier = value;
		// Also update servings if available
		if (originalServings) {
			customServings = Math.round(originalServings.value * value);
		}
	}

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ label: 'Recipes', href: '/recipes' },
		{ label: getSectionDisplayName(data.recipe.section), href: `/recipes?section=${encodeURIComponent(data.recipe.section)}` },
		{ label: data.recipe.category, href: `/recipes?category=${encodeURIComponent(data.recipe.category)}` },
		{ label: data.recipe.title }
	]);
</script>

<svelte:head>
	<title>{data.recipe.title} by {data.recipe.contributor} - Valheim Lodge Recipes</title>
	<meta name="description" content="{data.recipe.title} recipe by {data.recipe.contributor} from the Valheim Lodge cookbook" />
</svelte:head>

<!-- Print Styles -->
<style>
	@media print {
		/* Minimize page margins */
		@page {
			margin: 0.5in;
		}

		/* Hide non-essential elements */
		:global(nav),
		:global(header:has(.app-bar)),
		:global(footer),
		.no-print {
			display: none !important;
		}

		/* Reset background colors for print */
		:global(body) {
			background: white !important;
			color: black !important;
		}

		/* Remove all padding and margins, use full width */
		:global(main) {
			padding: 0 !important;
			margin: 0 !important;
			max-width: 100% !important;
		}

		:global(.container) {
			max-width: 100% !important;
			padding: 0 !important;
		}

		.print-container {
			max-width: 100% !important;
			width: 100% !important;
			padding: 0 !important;
			margin: 0 !important;
		}

		.print-container article {
			box-shadow: none !important;
			border: none !important;
			padding: 0 !important;
			margin: 0 !important;
			max-width: 100% !important;
			width: 100% !important;
		}

		/* Reduce spacing */
		.space-y-8 {
			gap: 0.5rem !important;
		}

		.space-y-4 {
			gap: 0.25rem !important;
		}

		/* Reduce card padding */
		.card {
			padding: 0.5rem !important;
			background: transparent !important;
			border: 1px solid #e5e5e5 !important;
		}

		/* Side-by-side layout for ingredients and instructions */
		.recipe-content {
			display: grid !important;
			grid-template-columns: 1fr 2fr !important;
			gap: 1rem !important;
			break-inside: avoid;
			width: 100% !important;
		}

		/* Compact header */
		header {
			margin-bottom: 0.5rem !important;
		}

		/* Ensure proper page breaks */
		section {
			break-inside: avoid;
		}

		/* Style badges for print */
		.badge {
			border: 1px solid #ccc !important;
			background: #f5f5f5 !important;
			color: black !important;
			padding: 0.125rem 0.5rem !important;
			font-size: 0.75rem !important;
		}
	}
</style>

<div class="print-container">
	<article class="space-y-8" itemscope itemtype="https://schema.org/Recipe">
		<header class="space-y-4">
			<nav class="flex justify-between items-center no-print" aria-label="Page navigation">
				<Breadcrumb items={breadcrumbItems} />
				<button onclick={printRecipe} class="btn btn-sm preset-outlined-primary-500 flex items-center gap-2">
					<Printer class="w-4 h-4" /> Print Recipe
				</button>
			</nav>
			<h1 class="h1" itemprop="name">{data.recipe.title}</h1>
			<p class="text-surface-600-400">
				<span>by </span>
				<a 
					href="/recipes?q={encodeURIComponent(data.recipe.contributor)}" 
					class="hover:text-primary-500 hover:underline transition-colors"
					itemprop="author"
				>{data.recipe.contributor}</a>
			</p>
			<div class="flex flex-wrap gap-2">
				<a 
					href="/recipes?category={encodeURIComponent(data.recipe.category)}" 
					class="badge preset-filled-secondary-500 hover:opacity-80 transition-opacity"
				>{data.recipe.category}</a>
				<a 
					href="/recipes?section={encodeURIComponent(data.recipe.section)}" 
					class="badge preset-filled-surface-200-800 hover:opacity-80 transition-opacity"
				>{getSectionDisplayName(data.recipe.section)}</a>
				{#if data.recipe.servings}
					<span class="badge preset-filled-surface-200-800" itemprop="recipeYield">
						{scalingEnabled && multiplier() !== 1 ? scaledServingsDisplay : data.recipe.servings}
					</span>
				{/if}
			</div>
		</header>

		<div class="recipe-content space-y-8">
			<section class="card preset-filled-surface-100-900 p-6 space-y-4" aria-labelledby="ingredients-heading">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<h2 id="ingredients-heading" class="h3">Ingredients</h2>
					
					<!-- Scaling Controls - Always available -->
					<div class="flex items-center gap-3 no-print">
						<button
							onclick={toggleScaling}
							class="btn btn-sm {scalingEnabled ? 'preset-filled-primary-500' : 'preset-outlined-primary-500'} flex items-center gap-2"
							aria-pressed={scalingEnabled}
						>
							<Calculator class="w-4 h-4" />
							{scalingEnabled ? 'Scaling On' : 'Scale Recipe'}
						</button>
					</div>
				</div>

				<!-- Expanded scaling controls -->
				{#if scalingEnabled}
					<div class="flex flex-wrap items-center gap-4 bg-surface-200-800 rounded-lg p-3 no-print">
						<!-- Multiplier presets - always available -->
						<div class="flex items-center gap-1">
							<span class="text-sm text-surface-600-400 mr-2">Quick:</span>
							{#each multiplierPresets as preset}
								<button
									onclick={() => setMultiplier(preset)}
									class="btn btn-sm px-3 {customMultiplier === preset ? 'preset-filled-primary-500' : 'preset-filled-surface-300-700'}"
									aria-pressed={customMultiplier === preset}
								>
									{preset}x
								</button>
							{/each}
						</div>

						<!-- Yield adjustment (when available) -->
						{#if originalServings}
							<div class="flex items-center gap-2">
								<span class="text-sm text-surface-600-400">Yield:</span>
								<button
									onclick={decrementServings}
									class="btn btn-sm preset-filled-surface-300-700 p-1"
									aria-label="Decrease yield"
									disabled={customServings <= 1}
								>
									<Minus class="w-4 h-4" />
								</button>
								<span class="w-24 text-center font-semibold text-sm">
									{scaledServingsDisplay}
								</span>
								<button
									onclick={incrementServings}
									class="btn btn-sm preset-filled-surface-300-700 p-1"
									aria-label="Increase yield"
									disabled={customServings >= 100}
								>
									<Plus class="w-4 h-4" />
								</button>
							</div>
						{/if}

						<button
							onclick={resetScale}
							class="btn btn-sm preset-outlined-surface-200-800 p-1"
							aria-label="Reset to original"
							title="Reset to original"
						>
							<RotateCcw class="w-4 h-4" />
						</button>
					</div>
				{/if}

				<!-- Scaled indicator -->
				{#if scalingEnabled && multiplier() !== 1}
					<div class="text-sm text-primary-500 font-medium bg-primary-500/10 px-3 py-2 rounded-lg">
						{#if originalServings}
							Scaled from <span class="line-through opacity-70">{data.recipe.servings}</span> to <strong>{scaledServingsDisplay}</strong>
						{:else}
							Scaled to <strong>{customMultiplier}x</strong> original amounts
						{/if}
					</div>
				{/if}

				<ul class="space-y-2 list-disc list-inside" aria-label="Ingredients list">
					{#each scaledIngredients as ingredient}
						<li itemprop="recipeIngredient">
							{#if ingredient.scaledAmount && scalingEnabled && multiplier() !== 1}
								<span class="font-semibold text-primary-600-400">{ingredient.scaledAmount}</span>
								<span class="text-xs text-surface-500 line-through ml-1">({ingredient.amount})</span>
							{:else if ingredient.amount}
								<span class="font-semibold">{ingredient.amount}</span>
							{/if}
							{#if ingredient.unit}
								<span>{ingredient.unit}</span>
							{/if}
							<span>{ingredient.item}</span>
							{#if ingredient.note}
								<span class="text-surface-500 italic">({ingredient.note})</span>
							{/if}
						</li>
					{/each}
				</ul>
			</section>

			<section class="card preset-filled-surface-100-900 p-6 space-y-4" aria-labelledby="instructions-heading">
				<h2 id="instructions-heading" class="h3">Instructions</h2>
				<ol class="space-y-4 list-decimal list-inside" itemprop="recipeInstructions">
					{#each data.recipe.instructions as step, index}
						<li class="pl-2">
							<span>{step}</span>
						</li>
					{/each}
				</ol>
			</section>
		</div>
	</article>

	<!-- Related Recipes -->
	{#if relatedRecipes.length > 0}
		<section class="space-y-4 mt-12 no-print" aria-labelledby="related-heading">
			<h2 id="related-heading" class="h3">You might also like</h2>
			<ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{#each relatedRecipes as recipe}
					<li>
						<a
							href="/recipes/{recipe.slug}"
							class="card preset-filled-surface-100-900 p-4 block hover:preset-filled-primary-500 transition-all duration-200 h-full"
						>
							<article class="space-y-2">
								<h3 class="h4 font-semibold">{recipe.title}</h3>
								<p class="text-sm text-surface-600-400">by {recipe.contributor}</p>
							</article>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
