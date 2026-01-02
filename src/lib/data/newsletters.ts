export interface Newsletter {
	label: string;
	path: string;
	sortOrder: number;
	summary?: string;
}

export interface YearNewsletters {
	year: number;
	newsletters: Newsletter[];
}

// Import summaries data
interface SummaryEntry {
	filename: string;
	summary: string;
	generatedAt: string;
}

interface SummariesData {
	summaries: SummaryEntry[];
	lastUpdated: string;
}

let summariesMap: Map<string, string> = new Map();

// Try to load summaries - this will be empty during build if file doesn't exist yet
try {
	const summariesData: SummariesData = await import('./newsletter-summaries.json');
	summariesMap = new Map(
		summariesData.summaries
			.filter((s) => s.summary) // Only include entries with actual summaries
			.map((s) => [s.filename, s.summary])
	);
} catch {
	// Summaries file doesn't exist yet, that's fine
	console.log('Newsletter summaries not yet generated');
}

// Month abbreviation to sort order mapping
const monthOrder: Record<string, number> = {
	Jan: 1,
	Feb: 2,
	Mar: 3,
	Apr: 4,
	May: 5,
	Jun: 6,
	Jul: 7,
	Aug: 8,
	Sep: 9,
	Oct: 10,
	Nov: 11,
	Dec: 12
};

// Month abbreviation to full name mapping
const monthNames: Record<string, string> = {
	Jan: 'January',
	Feb: 'February',
	Mar: 'March',
	Apr: 'April',
	May: 'May',
	Jun: 'June',
	Jul: 'July',
	Aug: 'August',
	Sep: 'September',
	Oct: 'October',
	Nov: 'November',
	Dec: 'December'
};

// Use Vite's glob import to get all PDF files at build time
// Note: In SvelteKit, 'static' folder contents are served from root, so we glob from there
const pdfFiles = import.meta.glob('/static/newsletters/*.pdf', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

function parseFilename(
	filepath: string
): { year: number; label: string; sortOrder: number; path: string } | null {
	// Extract filename from path: /static/newsletters/2025-Jan-Feb.pdf -> 2025-Jan-Feb.pdf
	const filename = filepath.split('/').pop()?.replace('.pdf', '');
	if (!filename) return null;

	// Parse patterns like: 2025-Jan-Feb, 2022-Dec-Jan, 2023-Feb-Mar
	const match = filename.match(/^(\d{4})-([A-Za-z]+)-([A-Za-z]+)$/);
	if (!match) return null;

	const [, yearStr, startMonth, endMonth] = match;
	const year = parseInt(yearStr);
	const startOrder = monthOrder[startMonth];
	const endOrder = monthOrder[endMonth];

	if (!startOrder || !endOrder) return null;

	const startName = monthNames[startMonth];
	const endName = monthNames[endMonth];

	// Handle year-spanning newsletters (e.g., Dec-Jan)
	const label =
		startOrder > endOrder
			? `${startName} ${year}-${endName} ${year + 1}`
			: `${startName}-${endName} ${year}`;

	// Convert /static/newsletters/file.pdf to /newsletters/file.pdf for serving
	const path = filepath.replace('/static', '');

	return { year, label, sortOrder: startOrder, path };
}

function buildNewslettersFromFiles(): YearNewsletters[] {
	const newslettersByYear = new Map<number, Newsletter[]>();

	for (const filepath of Object.keys(pdfFiles)) {
		const parsed = parseFilename(filepath);
		if (!parsed) continue;

		const { year, label, sortOrder, path } = parsed;

		// Get summary for this newsletter
		const filename = filepath.split('/').pop() || '';
		const summary = summariesMap.get(filename);

		if (!newslettersByYear.has(year)) {
			newslettersByYear.set(year, []);
		}

		newslettersByYear.get(year)!.push({ label, path, sortOrder, summary });
	}

	// Sort newsletters within each year by month order
	for (const newsletters of newslettersByYear.values()) {
		newsletters.sort((a, b) => a.sortOrder - b.sortOrder);
	}

	// Convert to array and sort years descending (newest first)
	return Array.from(newslettersByYear.entries())
		.map(([year, newsletters]) => ({ year, newsletters }))
		.sort((a, b) => b.year - a.year);
}

export const newsletters: YearNewsletters[] = buildNewslettersFromFiles();

export function getLatestNewsletter(): Newsletter | undefined {
	return newsletters[0]?.newsletters.at(-1);
}

export function getNewslettersByYear(year: number): YearNewsletters | undefined {
	return newsletters.find((n) => n.year === year);
}

export function getAllYears(): number[] {
	return newsletters.map((n) => n.year);
}
