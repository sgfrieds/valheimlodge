<script lang="ts">
	import { getLatestNewsletter, newsletters } from '$lib/data/newsletters';
	import { recipes, getSectionDisplayName } from '$lib/data/recipes';
	import { UtensilsCrossed, Newspaper, Calendar, ExternalLink, Users } from '@lucide/svelte';

	const latest = getLatestNewsletter();
	
	// Get a few featured recipes
	const norwegianRecipes = recipes.filter(r => r.section === 'Norwegian');
	const nonNorwegianRecipes = recipes.filter(r => r.section === 'Non-Norwegian');
	const totalRecipes = recipes.length;

	// External calendar URL - can be Google Calendar, Outlook, etc.
	// Desktop: month view with navigation
	const calendarEmbedDesktop = 'https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=America/Chicago&mode=MONTH&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0';
	// Mobile: agenda view (list format, more compact)
	const calendarEmbedMobile = 'https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=America/Chicago&mode=AGENDA&showTitle=0&showNav=0&showPrint=0&showTabs=0&showCalendars=0';
	const calendarPublicUrl = 'https://calendar.google.com/calendar/u/0?cid=YOUR_CALENDAR_ID';
	
	// Membership signup URL
	const joinUrl = 'https://members.sofn.com/newMembers/signup/join?country=US&district=1&lodge=364&lodgeName=Valheim';
</script>

<div class="space-y-8">
	<header class="text-center space-y-4 py-8">
		<p class="text-sm font-medium text-secondary-600-400 uppercase tracking-wide">Sons of Norway</p>
		<h1 class="h1">Welcome to Valheim Lodge</h1>
		<p class="text-xl text-surface-600-400">Celebrating Norwegian-American Heritage & Tradition</p>
		<p class="text-sm text-surface-500">Lodge #364 • Spring Grove, Minnesota</p>
	</header>

	<!-- Hero Grid -->
	<div class="grid md:grid-cols-2 gap-6">
		<!-- Recipes Section -->
		<section class="card preset-filled-primary-500 p-4 md:p-8 space-y-4 hover:scale-[1.02] transition-transform duration-200">
			<div class="text-center space-y-3">
				<h2 class="h3 md:h2 flex items-center justify-center gap-2"><UtensilsCrossed class="w-6 h-6 md:w-8 md:h-8" /> Recipe Collection</h2>
				<p class="text-base md:text-lg opacity-90">
					Discover {norwegianRecipes.length} authentic Norwegian-American recipes from our cookbook
				</p>
				<a href="/recipes" class="btn preset-filled-surface-50-950 w-full mt-4">
					Browse All Recipes
				</a>
			</div>
		</section>

		<!-- Newsletter Section -->
		<section class="card preset-filled-secondary-500 p-4 md:p-8 space-y-4 hover:scale-[1.02] transition-transform duration-200">
			<div class="text-center space-y-3">
				<h2 class="h3 md:h2 flex items-center justify-center gap-2"><Newspaper class="w-6 h-6 md:w-8 md:h-8" /> Newsletters</h2>
				<p class="text-base md:text-lg opacity-90">
					{newsletters.length} years of lodge news and events
				</p>
				{#if latest}
					<div class="badge preset-tonal-surface px-3 py-2">
						Latest: {latest.label}
					</div>
				{/if}
				<a href="/newsletters" class="btn preset-filled-surface-50-950 w-full mt-4">
					View Newsletter Archive
				</a>
			</div>
		</section>
	</div>


	<!-- About Section -->
	<section class="card preset-outlined-surface-200-800 p-8 text-center space-y-4">
		<h3 class="h3">About Valheim Lodge</h3>
		<p class="text-surface-600-400 max-w-3xl mx-auto">
			Valheim Lodge #364 is a chapter of <a href="https://www.sofn.com" target="_blank" rel="noopener noreferrer" class="text-primary-600-400 hover:underline">Sons of Norway</a> in 
			<a href="http://sofn-1.org/" target="_blank" rel="noopener noreferrer" class="text-primary-600-400 hover:underline">District 1</a>, 
			a fraternal organization dedicated to preserving and celebrating Norwegian-American heritage through community, 
			tradition, and the sharing of cherished recipes and stories.
		</p>
		<div class="flex flex-wrap justify-center gap-3">
			<a href="https://www.sofn.com" target="_blank" rel="noopener noreferrer" class="btn preset-outlined-primary-500 inline-flex items-center gap-2">
				Sons of Norway <ExternalLink class="w-4 h-4" />
			</a>
			<a href="http://sofn-1.org/" target="_blank" rel="noopener noreferrer" class="btn preset-outlined-primary-500 inline-flex items-center gap-2">
				District 1 <ExternalLink class="w-4 h-4" />
			</a>
		</div>
	</section>

	<!-- Join CTA Section -->
	<section class="card preset-filled-tertiary-500 p-8 text-center space-y-4">
		<Users class="w-12 h-12 mx-auto" />
		<h3 class="h2">Become a Member</h3>
		<p class="text-lg max-w-2xl mx-auto">
			Join Valheim Lodge and connect with others who share your passion for Norwegian heritage. 
			Enjoy cultural events, community gatherings, and exclusive member benefits.
		</p>
		<a href={joinUrl} target="_blank" rel="noopener noreferrer" class="btn preset-filled-surface-950-50 text-lg px-8 py-3 inline-flex items-center gap-2">
			Join Valheim Lodge Today <ExternalLink class="w-5 h-5" />
		</a>
	</section>

	<!-- Meetings & Events Section -->
	<section class="card preset-outlined-surface-200-800 p-6 space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-4">
			<h3 class="h3 flex items-center gap-2"><Calendar class="w-6 h-6 text-secondary-500" /> Meetings & Events</h3>
			<a href={calendarPublicUrl} target="_blank" rel="noopener noreferrer" class="btn btn-sm preset-outlined-secondary-500 inline-flex items-center gap-2">
				Open Full Calendar <ExternalLink class="w-4 h-4" />
			</a>
		</div>
		<p class="text-surface-600-400">
			Join us for our regular monthly meetings and special events throughout the year.
		</p>
		<!-- Desktop calendar: month view -->
		<div class="hidden md:block aspect-video w-full rounded-container overflow-hidden border border-surface-300-700">
			<iframe 
				src={calendarEmbedDesktop}
				title="Valheim Lodge Events Calendar"
				class="w-full h-full"
				frameborder="0"
				scrolling="no"
			></iframe>
		</div>
		<!-- Mobile calendar: agenda/list view -->
		<div class="md:hidden h-80 w-full rounded-container overflow-hidden border border-surface-300-700">
			<iframe 
				src={calendarEmbedMobile}
				title="Valheim Lodge Events Calendar"
				class="w-full h-full"
				frameborder="0"
				scrolling="no"
			></iframe>
		</div>
		<p class="text-xs text-surface-500 text-center">
			Calendar not loading? <a href={calendarPublicUrl} target="_blank" rel="noopener noreferrer" class="text-primary-600-400 hover:underline">View directly on Google Calendar</a>
		</p>
	</section>
</div>
