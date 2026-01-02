<script lang="ts">
	import { ChevronRight, Home } from '@lucide/svelte';

	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	let { items }: { items: BreadcrumbItem[] } = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumb-nav print:hidden">
	<ol class="flex flex-wrap items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
		<li class="flex items-center">
			<a
				href="/"
				class="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
			>
				<Home class="w-4 h-4" />
				<span class="sr-only">Home</span>
			</a>
		</li>
		{#each items as item, i}
			<li class="flex items-center gap-1">
				<ChevronRight class="w-4 h-4 text-surface-400" />
				{#if item.href && i < items.length - 1}
					<a
						href={item.href}
						class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
					>
						{item.label}
					</a>
				{:else}
					<span class="text-surface-900 dark:text-surface-100 font-medium">
						{item.label}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
