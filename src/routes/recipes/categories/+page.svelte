<script lang="ts">
	import { recipes, getRecipesByCategory } from '$lib/data/recipes';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import RecipeBrowseNav from '$lib/components/RecipeBrowseNav.svelte';
	import { 
		Cookie, 
		Cake, 
		Croissant, 
		Soup,
		Beef,
		Salad,
		Utensils,
		ChefHat,
		Wheat,
		CookingPot,
		IceCream,
		BookOpen
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	const categories = getRecipesByCategory();

	// Category icon mapping using Lucide components
	const categoryIcons: Record<string, Component> = {
		'Lefse': Wheat,
		'Flat Bread': Wheat,
		'Crackers': Cookie,
		'Cookies': Cookie,
		'Cakes': Cake,
		'Pastries': Croissant,
		'Doughnuts': Cookie,
		'Rømmegrøt': Soup,
		'Sweet Soup': Soup,
		'Waffles': Utensils,
		'Pancakes': Utensils,
		'Dumplings': ChefHat,
		'Soups': Soup,
		'Stews': CookingPot,
		'Main Dishes': Beef,
		'Bars': Cookie,
		'Appetizers': Salad,
		'Salads': Salad,
		'Side Dishes': Utensils,
		'Sauces': CookingPot,
		'Desserts': IceCream,
		'Breads': Wheat
	};

	function getIcon(category: string): Component {
		return categoryIcons[category] || BookOpen;
	}
</script>

<svelte:head>
	<title>Recipe Categories - Valheim Lodge</title>
	<meta name="description" content="Browse recipes by category from the Valheim Lodge cookbook" />
</svelte:head>

<div class="space-y-8">
	<Breadcrumb items={[{ label: 'Recipes', href: '/recipes' }, { label: 'Categories' }]} />

	<header class="text-center space-y-4">
		<h1 class="h1">Recipe Categories</h1>
		<p class="text-surface-600-400">Explore our collection by type of dish</p>
		<p class="text-sm text-surface-500">{categories.length} categories • {recipes.length} recipes</p>
	</header>

	<!-- Browse Navigation -->
	<RecipeBrowseNav />

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each categories as category}
			{@const IconComponent = getIcon(category.name)}
			<a
				href="/recipes?category={encodeURIComponent(category.name)}"
				class="card preset-filled-surface-100-900 p-6 hover:preset-filled-primary-500 transition-all duration-200 hover:scale-105"
			>
				<article class="text-center space-y-3">
					<IconComponent class="w-12 h-12 mx-auto" />
					<h2 class="h4 font-semibold">{category.name}</h2>
					<p class="text-sm text-surface-500">
						{category.recipes.length} recipe{category.recipes.length !== 1 ? 's' : ''}
					</p>
				</article>
			</a>
		{/each}
	</div>
</div>
