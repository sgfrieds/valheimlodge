<script lang="ts">
	import './layout.css';
	import { AppBar, Navigation } from '@skeletonlabs/skeleton-svelte';
	import { HouseIcon, BookOpenIcon, NewspaperIcon, MenuIcon, XIcon } from '@lucide/svelte';

	let { children } = $props();
	let mobileMenuOpen = $state(false);
</script>

<svelte:head>
	<title>Valheim Lodge #364 | Sons of Norway</title>
	<meta name="description" content="Valheim Lodge #364 is a Sons of Norway lodge. Browse our newsletter archive and collection of traditional Norwegian recipes.">
	<meta property="og:title" content="Valheim Lodge #364 | Sons of Norway">
	<meta property="og:description" content="Valheim Lodge #364 is a Sons of Norway lodge. Browse our newsletter archive and collection of traditional Norwegian recipes.">
</svelte:head>

<div class="min-h-screen flex flex-col bg-surface-50-950">
	<AppBar>
		<!-- Desktop: show nav inline; Mobile: show hamburger -->
		<AppBar.Toolbar class="grid-cols-[1fr_auto]">
			<AppBar.Lead>
				<a href="/" class="flex items-center gap-3 hover:text-primary-500 transition-colors">
					<img src="/apple-touch-icon-152x152.png" alt="Valheim Lodge" class="w-10 h-10 rounded-lg" />
					<div class="flex flex-col">
						<span class="text-xs text-surface-500">Sons of Norway</span>
						<span class="text-xl font-bold whitespace-nowrap">Valheim Lodge</span>
					</div>
				</a>
			</AppBar.Lead>
			<AppBar.Trail>
				<!-- Desktop nav -->
				<Navigation layout="bar" class="hidden md:flex">
					<Navigation.TriggerAnchor href="/">
						<HouseIcon class="size-4" />
						<span>Home</span>
					</Navigation.TriggerAnchor>
					<Navigation.TriggerAnchor href="/recipes">
						<BookOpenIcon class="size-4" />
						<span>Recipes</span>
					</Navigation.TriggerAnchor>
					<Navigation.TriggerAnchor href="/newsletters">
						<NewspaperIcon class="size-4" />
						<span>Newsletters</span>
					</Navigation.TriggerAnchor>
				</Navigation>
				<!-- Mobile hamburger -->
				<button
					type="button"
					class="btn-icon hover:preset-tonal md:hidden"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<XIcon class="size-6" />
					{:else}
						<MenuIcon class="size-6" />
					{/if}
				</button>
			</AppBar.Trail>
		</AppBar.Toolbar>

		<!-- Mobile nav dropdown -->
		{#if mobileMenuOpen}
			<nav class="md:hidden flex flex-col gap-2 pt-2 border-t border-surface-200-800">
				<a
					href="/"
					class="btn hover:preset-tonal justify-start gap-2"
					onclick={() => (mobileMenuOpen = false)}
				>
					<HouseIcon class="size-5" />
					<span>Home</span>
				</a>
				<a
					href="/recipes"
					class="btn hover:preset-tonal justify-start gap-2"
					onclick={() => (mobileMenuOpen = false)}
				>
					<BookOpenIcon class="size-5" />
					<span>Recipes</span>
				</a>
				<a
					href="/newsletters"
					class="btn hover:preset-tonal justify-start gap-2"
					onclick={() => (mobileMenuOpen = false)}
				>
					<NewspaperIcon class="size-5" />
					<span>Newsletters</span>
				</a>
			</nav>
		{/if}
	</AppBar>

	<main class="container mx-auto p-4 md:p-8 flex-1">
		{@render children()}
	</main>

	<footer class="bg-surface-100-900 p-6 text-center text-sm text-surface-500 space-y-2">
		<p>Valheim Lodge #364 • <a href="https://www.sofn.com" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:underline">Sons of Norway</a></p>
		<p>&copy; {new Date().getFullYear()} Valheim Lodge. All rights reserved.</p>
	</footer>
</div>
