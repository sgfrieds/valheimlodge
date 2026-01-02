<script lang="ts">
	import { FileText, ExternalLink } from '@lucide/svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.year} Newsletters - Valheim Lodge</title>
</svelte:head>

<div class="space-y-8">
	<Breadcrumb items={[{ label: 'Newsletters', href: '/newsletters' }, { label: data.year.toString() }]} />

	<header class="space-y-4">
		<h1 class="h1">{data.year} Newsletters</h1>
	</header>

	<ul class="space-y-4">
		{#each data.newsletters as newsletter}
			<li>
				<a
					href={newsletter.path}
					target="_blank"
					rel="noopener noreferrer"
					class="card preset-filled-surface-100-900 p-4 block hover:preset-filled-primary-500 transition-all duration-200 group"
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex items-start gap-3 flex-1 min-w-0">
							<FileText class="w-5 h-5 mt-0.5 shrink-0 text-primary-500 group-hover:text-inherit" />
							<div class="space-y-1 min-w-0">
								<div class="font-semibold">{newsletter.label}</div>
								{#if newsletter.summary}
									<p class="text-sm text-surface-600-400 group-hover:text-inherit/80 line-clamp-2">
										{newsletter.summary}
									</p>
								{/if}
							</div>
						</div>
						<div class="flex items-center gap-2 shrink-0">
							<span class="badge preset-filled-primary-500 group-hover:preset-filled-surface-100-900 transition-all">
								PDF
							</span>
							<ExternalLink class="w-4 h-4 opacity-50" />
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	<nav class="flex gap-4 justify-between pt-8 border-t border-surface-300-700">
		{#if data.allYears.indexOf(data.year) < data.allYears.length - 1}
			{@const prevYear = data.allYears[data.allYears.indexOf(data.year) + 1]}
			<a href="/newsletters/{prevYear}" class="btn hover:preset-tonal-primary">&larr; {prevYear}</a>
		{:else}
			<span></span>
		{/if}

		{#if data.allYears.indexOf(data.year) > 0}
			{@const nextYear = data.allYears[data.allYears.indexOf(data.year) - 1]}
			<a href="/newsletters/{nextYear}" class="btn hover:preset-tonal-primary">{nextYear} &rarr;</a>
		{/if}
	</nav>
</div>
