<script lang="ts">
	import { Search, SortAsc, FolderOpen, Users } from '@lucide/svelte';
	import { page } from '$app/stores';

	// Determine current page for active state
	const currentPath = $derived($page.url.pathname);
	
	const navItems = [
		{ href: '/recipes', label: 'Search', icon: Search, match: (p: string) => p === '/recipes' },
		{ href: '/recipes/a-z', label: 'A-Z', icon: SortAsc, match: (p: string) => p === '/recipes/a-z' },
		{ href: '/recipes/categories', label: 'Categories', icon: FolderOpen, match: (p: string) => p === '/recipes/categories' },
		{ href: '/recipes/contributors', label: 'Contributors', icon: Users, match: (p: string) => p === '/recipes/contributors' }
	];
</script>

<nav class="flex flex-wrap justify-center gap-2" aria-label="Recipe browse options">
	{#each navItems as item}
		{@const isActive = item.match(currentPath)}
		<a 
			href={item.href} 
			class="btn btn-sm flex items-center gap-1.5 {isActive ? 'preset-filled-primary-500' : 'preset-outlined-surface-200-800 hover:preset-tonal-primary'}"
			aria-current={isActive ? 'page' : undefined}
		>
			<item.icon class="w-4 h-4" />
			{item.label}
		</a>
	{/each}
</nav>
