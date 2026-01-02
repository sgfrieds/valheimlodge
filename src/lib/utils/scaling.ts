/**
 * Utility functions for scaling recipe ingredients
 */

/**
 * Parse a fraction string like "1/2" or "3/4" into a decimal
 */
function parseFraction(fraction: string): number {
	const parts = fraction.split('/');
	if (parts.length === 2) {
		const numerator = parseFloat(parts[0]);
		const denominator = parseFloat(parts[1]);
		if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
			return numerator / denominator;
		}
	}
	return NaN;
}

/**
 * Parse an amount string that may contain whole numbers, fractions, or mixed numbers
 * Examples: "2", "1/2", "1 1/2", "2-3"
 */
export function parseAmount(
	amount: string
): { value: number; isRange: boolean; rangeEnd?: number } | null {
	if (!amount || amount.trim() === '') {
		return null;
	}

	const trimmed = amount.trim();

	// Check for ranges like "2-3" or "2 - 3"
	const rangeMatch = trimmed.match(/^([\d\s/]+)\s*-\s*([\d\s/]+)$/);
	if (rangeMatch) {
		const start = parseAmount(rangeMatch[1]);
		const end = parseAmount(rangeMatch[2]);
		if (start && end) {
			return { value: start.value, isRange: true, rangeEnd: end.value };
		}
	}

	// Check for mixed numbers like "1 1/2" (whole number followed by fraction)
	const mixedMatch = trimmed.match(/^(\d+)\s+(\d+\/\d+)$/);
	if (mixedMatch) {
		const whole = parseFloat(mixedMatch[1]);
		const fraction = parseFraction(mixedMatch[2]);
		if (!isNaN(whole) && !isNaN(fraction)) {
			return { value: whole + fraction, isRange: false };
		}
	}

	// Check for simple fractions like "1/2"
	if (trimmed.includes('/')) {
		const fraction = parseFraction(trimmed);
		if (!isNaN(fraction)) {
			return { value: fraction, isRange: false };
		}
	}

	// Check for simple numbers
	const num = parseFloat(trimmed);
	if (!isNaN(num)) {
		return { value: num, isRange: false };
	}

	return null;
}

/**
 * Convert a decimal to a nice fraction string
 */
function decimalToFraction(decimal: number): string {
	// Handle whole numbers
	if (Number.isInteger(decimal)) {
		return decimal.toString();
	}

	// Common cooking fractions to try
	const fractions: [number, string][] = [
		[0.125, '1/8'],
		[0.25, '1/4'],
		[0.333, '1/3'],
		[0.375, '3/8'],
		[0.5, '1/2'],
		[0.625, '5/8'],
		[0.667, '2/3'],
		[0.75, '3/4'],
		[0.875, '7/8']
	];

	const whole = Math.floor(decimal);
	const fractional = decimal - whole;

	// Find the closest common fraction
	let closestFraction = '';
	let closestDiff = Infinity;

	for (const [value, display] of fractions) {
		const diff = Math.abs(fractional - value);
		if (diff < closestDiff && diff < 0.05) {
			closestDiff = diff;
			closestFraction = display;
		}
	}

	if (closestFraction) {
		return whole > 0 ? `${whole} ${closestFraction}` : closestFraction;
	}

	// If no close fraction found, round to 2 decimal places
	return decimal.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Scale an amount string by a multiplier
 */
export function scaleAmount(amount: string, multiplier: number): string {
	const parsed = parseAmount(amount);

	if (!parsed) {
		return amount; // Return original if can't parse
	}

	if (parsed.isRange && parsed.rangeEnd !== undefined) {
		const scaledStart = decimalToFraction(parsed.value * multiplier);
		const scaledEnd = decimalToFraction(parsed.rangeEnd * multiplier);
		return `${scaledStart}-${scaledEnd}`;
	}

	return decimalToFraction(parsed.value * multiplier);
}

/**
 * Parse a servings string to extract the number
 * Examples: "Serves 4", "Makes 12", "6 servings", "4-6 servings"
 */
export function parseServings(
	servings: string
): { value: number; isRange: boolean; rangeEnd?: number } | null {
	if (!servings) return null;

	// Try to find a range like "4-6" or "4 - 6"
	const rangeMatch = servings.match(/(\d+)\s*-\s*(\d+)/);
	if (rangeMatch) {
		return {
			value: parseInt(rangeMatch[1]),
			isRange: true,
			rangeEnd: parseInt(rangeMatch[2])
		};
	}

	// Try to find any number
	const numMatch = servings.match(/\d+/);
	if (numMatch) {
		return { value: parseInt(numMatch[0]), isRange: false };
	}

	return null;
}

/**
 * Format servings for display
 */
export function formatServings(original: string, multiplier: number): string {
	const parsed = parseServings(original);
	if (!parsed) return original;

	// Extract the text parts (like "Serves", "Makes", "servings")
	const beforeNum = original.match(/^[^\d]*/)?.[0] || '';
	const afterNum = original.match(/[^\d]*$/)?.[0] || '';

	if (parsed.isRange && parsed.rangeEnd !== undefined) {
		const scaledStart = Math.round(parsed.value * multiplier);
		const scaledEnd = Math.round(parsed.rangeEnd * multiplier);
		return `${beforeNum}${scaledStart}-${scaledEnd}${afterNum}`.trim();
	}

	const scaled = Math.round(parsed.value * multiplier);
	return `${beforeNum}${scaled}${afterNum}`.trim();
}
