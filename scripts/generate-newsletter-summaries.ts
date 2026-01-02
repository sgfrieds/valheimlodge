/**
 * Script to generate newsletter summaries using Ollama (deepseek-r1)
 *
 * Usage: npx tsx scripts/generate-newsletter-summaries.ts
 *
 * This script:
 * 1. Reads all PDF files from static/newsletters
 * 2. Extracts text from each PDF
 * 3. Sends text to Ollama for summarization
 * 4. Saves results incrementally to src/lib/data/newsletter-summaries.json
 * 5. Resumes from where it left off if interrupted
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// pdf-parse v1 doesn't support ESM, use require
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const NEWSLETTERS_DIR = path.join(process.cwd(), 'static', 'newsletters');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'newsletter-summaries.json');
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'deepseek-r1';

interface NewsletterSummary {
	filename: string;
	summary: string;
	generatedAt: string;
}

interface SummariesData {
	summaries: NewsletterSummary[];
	lastUpdated: string;
}

/**
 * Load existing summaries from file (for resume capability)
 */
function loadExistingSummaries(): SummariesData {
	try {
		if (fs.existsSync(OUTPUT_FILE)) {
			const data = fs.readFileSync(OUTPUT_FILE, 'utf-8');
			return JSON.parse(data);
		}
	} catch (error) {
		console.log('No existing summaries file found, starting fresh.');
	}
	return { summaries: [], lastUpdated: '' };
}

/**
 * Save summaries to file
 */
function saveSummaries(data: SummariesData): void {
	data.lastUpdated = new Date().toISOString();
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, '\t'));
}

/**
 * Get list of PDF files that haven't been processed yet
 */
function getPendingPDFs(existingSummaries: NewsletterSummary[]): string[] {
	const processedFiles = new Set(existingSummaries.map((s) => s.filename));
	const allPDFs = fs.readdirSync(NEWSLETTERS_DIR).filter((f) => f.endsWith('.pdf'));

	return allPDFs.filter((pdf) => !processedFiles.has(pdf)).sort();
}

/**
 * Extract text from a PDF file
 */
async function extractPDFText(filepath: string): Promise<string> {
	const dataBuffer = fs.readFileSync(filepath);
	const data = await pdfParse(dataBuffer);
	return data.text;
}

/**
 * Send text to Ollama for summarization
 */
async function summarizeWithOllama(text: string, filename: string): Promise<string> {
	const prompt = `Summarize this Sons of Norway lodge newsletter in 2-3 sentences. Focus on key upcoming events, dates, and announcements. Output ONLY the summary text with no preamble or introduction.

Newsletter content:
${text.slice(0, 4000)}`;

	const response = await fetch(OLLAMA_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			model: MODEL,
			prompt,
			stream: false,
			options: {
				temperature: 0.3,
				num_predict: 8000 // deepseek-r1 needs lots of tokens for <think> + response
			}
		})
	});

	if (!response.ok) {
		throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
	}

	const result = (await response.json()) as { response: string };

	// deepseek-r1 includes <think>...</think> tags, extract just the final answer
	let summary = result.response;

	// Debug: show raw response info
	console.log(`    Raw response length: ${summary.length} chars`);
	const hasThinkOpen = summary.includes('<think>');
	const hasThinkClose = summary.includes('</think>');
	console.log(`    Has <think>: ${hasThinkOpen}, has </think>: ${hasThinkClose}`);

	const thinkEnd = summary.lastIndexOf('</think>');
	if (thinkEnd !== -1) {
		summary = summary.slice(thinkEnd + 8).trim();
	}

	// If summary is empty but we have content, the model might not have finished thinking
	// or the response format is different - try to extract useful content
	if (!summary && result.response) {
		// Remove think tags and get whatever content is there
		summary = result.response
			.replace(/<think>[\s\S]*?<\/think>/g, '')
			.replace(/<think>[\s\S]*/g, '') // Handle unclosed think tag
			.trim();

		// If still empty, just use the raw response (without think tags if possible)
		if (!summary) {
			const thinkStart = result.response.indexOf('<think>');
			if (thinkStart > 0) {
				summary = result.response.slice(0, thinkStart).trim();
			}
		}
	}

	// Clean up any remaining artifacts
	summary = summary.replace(/^(Here's|Here is|The|This).*?:\s*/i, '').trim();

	// Check for truncation indicators (summary starts mid-sentence)
	const truncationIndicators = /^[a-z]|^\d+\s*(a\.m\.|p\.m\.|am|pm)|^[,;:]/;
	if (truncationIndicators.test(summary)) {
		console.log(
			`    ⚠️  Warning: Summary may be truncated (starts with: "${summary.slice(0, 30)}...")`
		);
	}

	return summary;
}

/**
 * Check if a summary appears to be truncated
 */
function isTruncated(summary: string): boolean {
	if (!summary) return true;
	const truncationIndicators = /^[a-z]|^\d+\s*(a\.m\.|p\.m\.|am|pm)|^[,;:]/;
	return truncationIndicators.test(summary);
}

/**
 * Get list of truncated summaries that need re-processing
 */
function getTruncatedSummaries(existingSummaries: NewsletterSummary[]): string[] {
	return existingSummaries.filter((s) => isTruncated(s.summary)).map((s) => s.filename);
}

/**
 * Main processing function
 */
async function main() {
	const reprocessTruncated = process.argv.includes('--fix-truncated');

	console.log('📰 Newsletter Summary Generator');
	console.log('================================\n');

	// Load existing summaries
	const data = loadExistingSummaries();
	console.log(`Found ${data.summaries.length} existing summaries.`);

	let pdfsToProcess: string[];

	if (reprocessTruncated) {
		// Re-process truncated summaries
		pdfsToProcess = getTruncatedSummaries(data.summaries);
		console.log(`Found ${pdfsToProcess.length} truncated summaries to fix.\n`);

		// Remove truncated entries so they'll be re-added
		data.summaries = data.summaries.filter((s) => !isTruncated(s.summary));
		saveSummaries(data);
	} else {
		// Get pending PDFs (new ones only)
		pdfsToProcess = getPendingPDFs(data.summaries);
		console.log(`Found ${pdfsToProcess.length} PDFs to process.\n`);
	}

	if (pdfsToProcess.length === 0) {
		console.log('✅ All newsletters have been summarized!');
		return;
	}

	// Process each PDF
	for (let i = 0; i < pdfsToProcess.length; i++) {
		const filename = pdfsToProcess[i];
		const filepath = path.join(NEWSLETTERS_DIR, filename);

		console.log(`[${i + 1}/${pdfsToProcess.length}] Processing: ${filename}`);

		try {
			// Extract text
			console.log('  📄 Extracting text...');
			const text = await extractPDFText(filepath);

			if (text.trim().length < 100) {
				console.log('  ⚠️  Insufficient text extracted, skipping.');
				continue;
			}

			// Summarize
			console.log('  🤖 Generating summary with Ollama...');
			const summary = await summarizeWithOllama(text, filename);

			// Add to data
			data.summaries.push({
				filename,
				summary,
				generatedAt: new Date().toISOString()
			});

			// Save immediately (resume capability)
			saveSummaries(data);
			console.log('  ✅ Saved!\n');

			// Small delay to be nice to Ollama
			await new Promise((resolve) => setTimeout(resolve, 500));
		} catch (error) {
			console.error(`  ❌ Error processing ${filename}:`, error);
			console.log('  Continuing with next file...\n');
		}
	}

	console.log('\n================================');
	console.log(`✅ Complete! ${data.summaries.length} newsletters summarized.`);
	console.log(`Output saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
