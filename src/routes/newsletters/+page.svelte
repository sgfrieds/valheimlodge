<script lang="ts">
	import { newsletters, getLatestNewsletter } from '$lib/data/newsletters';
	import { Calendar, FileText, ExternalLink, Sparkles } from '@lucide/svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const latestNewsletter = getLatestNewsletter();
	
	// Get recent newsletters with summaries (last 3)
	const recentWithSummaries = newsletters
		.flatMap((y) => y.newsletters.map((n) => ({ ...n, year: y.year })))
		.filter((n) => n.summary)
		.slice(0, 3);
</script>

<svelte:head>
	<title>Newsletters - Valheim Lodge</title>
</svelte:head>

<div class="space-y-8">
	<Breadcrumb items={[{ label: 'Newsletters' }]} />

	<header class="text-center space-y-4">
		<h1 class="h1">Newsletters</h1>
		<p class="text-surface-600-400">Browse newsletters by year</p>
	</header>

	<!-- Latest Newsletter Highlight -->
	{#if latestNewsletter}
		<section class="card preset-filled-primary-500 p-6 space-y-3">
			<div class="flex items-center gap-2 text-sm font-medium opacity-90">
				<Sparkles class="w-4 h-4" />
				Latest Newsletter
			</div>
			<a
				href={latestNewsletter.path}
				target="_blank"
				rel="noopener noreferrer"
				class="block hover:opacity-90 transition-opacity"
			>
				<div class="flex items-center justify-between gap-4">
					<div class="space-y-1">
						<h2 class="h3 font-bold">{latestNewsletter.label}</h2>
						{#if latestNewsletter.summary}
							<p class="text-sm opacity-80 line-clamp-2">{latestNewsletter.summary}</p>
						{/if}
					</div>
					<ExternalLink class="w-5 h-5 shrink-0" />
				</div>
			</a>
		</section>
	{/if}

	<!-- Recent Summaries -->
	{#if recentWithSummaries.length > 0}
		<section class="space-y-4">
			<h2 class="h3">Recent Highlights</h2>
			<div class="grid gap-4 md:grid-cols-3">
				{#each recentWithSummaries as newsletter}
					<a
						href={newsletter.path}
						target="_blank"
						rel="noopener noreferrer"
						class="card preset-filled-surface-100-900 p-4 space-y-2 hover:preset-filled-primary-500 transition-all duration-200 group"
					>
						<div class="flex items-center justify-between">
							<span class="font-semibold">{newsletter.label}</span>
							<FileText class="w-4 h-4 text-primary-500 group-hover:text-inherit" />
						</div>
						<p class="text-sm text-surface-600-400 group-hover:text-inherit/80 line-clamp-3">
							{newsletter.summary}
						</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Browse by Year -->
	<section class="space-y-4">
		<h2 class="h3">Browse by Year</h2>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each newsletters as { year, newsletters: yearNewsletters }}
				<a
					href="/newsletters/{year}"
					class="card preset-filled-surface-100-900 p-6 text-center hover:preset-filled-primary-500 transition-all duration-200 group"
				>
					<div class="flex flex-col items-center gap-2">
						<Calendar class="w-6 h-6 text-primary-500 group-hover:text-inherit" />
						<span class="h3 font-bold">{year}</span>
						<span class="text-sm text-surface-500 group-hover:text-inherit/70">
							{yearNewsletters.length} issue{yearNewsletters.length !== 1 ? 's' : ''}
						</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>
