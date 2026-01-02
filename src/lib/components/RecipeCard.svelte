<script lang="ts">
	import type { Recipe } from '$lib/data/recipes';

	interface Props {
		recipe: Recipe;
		showCategory?: boolean;
		showContributor?: boolean;
		showServings?: boolean;
		compact?: boolean;
	}

	let { 
		recipe, 
		showCategory = true, 
		showContributor = true, 
		showServings = false,
		compact = false 
	}: Props = $props();
</script>

<a
	href="/recipes/{recipe.slug}"
	class="card preset-filled-surface-100-900 block hover:preset-filled-primary-500 transition-all duration-200 group {compact ? 'p-3' : 'p-4'}"
>
	<article class="{compact ? 'space-y-1' : 'space-y-2'}">
		<h4 class="{compact ? 'font-medium' : 'h4 font-semibold'}">{recipe.title}</h4>
		{#if showContributor || showCategory || showServings}
			<div class="text-sm text-surface-600-400 group-hover:text-inherit/80 flex flex-wrap gap-x-2 gap-y-0.5">
				{#if showContributor}
					<span>by {recipe.contributor}</span>
				{/if}
				{#if showCategory}
					<span class="{showContributor ? 'before:content-[\"•\"] before:mr-2' : ''}">{recipe.category}</span>
				{/if}
				{#if showServings && recipe.servings}
					<span class="before:content-['•'] before:mr-2">{recipe.servings}</span>
				{/if}
			</div>
		{/if}
	</article>
</a>
