# Valheim Lodge Website UX Improvements

## Overview

This document outlines planned improvements to enhance the user experience of the Valheim Lodge website, which was recently ported from a barebones static site to SvelteKit.

## Current State

- ✅ Homepage with recipe and newsletter overview
- ✅ Recipe collection with 109+ recipes (Norwegian & Non-Norwegian sections)
- ✅ Newsletter archive
- ✅ Basic navigation

---

## Quick Wins (High Impact, Lower Effort)

### 1. Recipe Search & Filtering

**Status:** ✅ Complete

Add search and filter functionality to help users find recipes quickly.

- [x] Search bar to find recipes by title or ingredient
- [x] Filter by section (Norwegian / Non-Norwegian)
- [x] Filter by category
- [x] Real-time results as user types
- [x] URL parameter support for deep linking

### 2. Contributor Index

**Status:** ✅ Complete

Honor the recipe contributors with a dedicated browseable index.

- [x] New `/recipes/contributors` page
- [x] List all unique contributors with recipe counts
- [x] Link to view all recipes by each contributor
- [x] Alphabetical sorting

### 3. Print-Friendly Recipe Pages

**Status:** ✅ Complete

Make recipes kitchen-ready with print optimization.

- [x] Print-specific CSS (`@media print`)
- [x] "Print Recipe" button on each recipe page
- [x] Hide navigation and non-essential elements when printing
- [x] Clean layout for printed recipes

### 4. Category Browse Page

**Status:** ✅ Complete

Visual category exploration for better recipe discovery.

- [x] New `/recipes/categories` page
- [x] Display categories as cards with emoji icons
- [x] Show recipe count per category
- [x] Link to filtered recipe list for each category

### 5. Related Recipes Component

**Status:** ✅ Complete

Encourage exploration by showing related content.

- [x] "You might also like" section on recipe pages
- [x] Show up to 4 recipes from same category
- [x] Randomize selection for variety
- [x] Hidden when printing

---

## Medium-Effort Enhancements

### 6. Recipe Scaling Calculator

**Status:** ✅ Complete

Allow users to adjust serving sizes with automatic ingredient recalculation.

- [x] Parse ingredient amounts (whole numbers, fractions, mixed numbers, ranges)
- [x] "Scale Recipe" toggle button on recipes with servings info
- [x] +/- buttons and input field for custom serving count
- [x] Real-time ingredient scaling with fraction-friendly display
- [x] Show original amounts alongside scaled values
- [x] Reset button to restore original servings
- [x] Hidden when printing (shows original amounts)

### 7. Newsletter Previews

**Status:** ✅ Complete

Add brief descriptions or highlights for each newsletter to help users decide which to read.

- [x] Script to extract PDF text and generate summaries with Ollama (deepseek-r1)
- [x] Summaries stored in newsletter-summaries.json with resume capability
- [x] Newsletter year pages show summaries under each issue
- [x] Main newsletters page highlights latest newsletter with summary
- [x] "Recent Highlights" section showing newsletters with summaries
- [x] Lucide icons for visual polish

### 8. Breadcrumb Navigation

**Status:** ✅ Complete

Show navigation path: Home > Recipes > Norwegian > Lefse > Recipe Name

- [x] Reusable Breadcrumb component with Lucide icons
- [x] Recipe pages show: Home > Recipes > Section > Category > Recipe Name
- [x] Category page shows: Home > Recipes > Categories
- [x] Contributors page shows: Home > Recipes > Contributors
- [x] A-Z index shows: Home > Recipes > A-Z Index
- [x] Hidden when printing

### 9. Recently Added Recipes

**Status:** 🔜 Planned

Homepage widget showing newest additions to encourage return visits.

### 10. Alphabetical Recipe Index

**Status:** ✅ Complete

A-Z listing page for quick browsing by recipe name.

- [x] New `/recipes/a-z` route
- [x] Recipes grouped by first letter
- [x] Sticky alphabet quick-nav bar with letter buttons
- [x] Disabled letters for unused letters
- [x] Smooth scroll to letter sections
- [x] Recipe count per letter
- [x] Quick link from main recipes page

---

## Future Considerations

- **Dark mode toggle** - Respect system preference and allow manual override
- **Favorites/bookmarks** - Let users save favorite recipes (local storage)
- **Recipe notes** - Allow users to add personal notes to recipes
- **Shopping list generator** - Combine ingredients from multiple recipes
- **Mobile app wrapper** - PWA support for offline access

---

## Technical Notes

### Stack

- SvelteKit
- Skeleton UI (Tailwind-based)
- TypeScript
- Static JSON data storage

### Data Structure

Recipes are stored in `src/lib/data/recipes.json` with the following structure:

```json
{
  "slug": "recipe-slug",
  "title": "Recipe Title",
  "contributor": "Contributor Name",
  "category": "Category",
  "section": "Norwegian" | "Non-Norwegian",
  "servings": "Optional serving info",
  "ingredients": [...],
  "instructions": [...]
}
```

---

## Progress Log

| Date       | Improvement               | Status      |
| ---------- | ------------------------- | ----------- |
| 2026-01-01 | Recipe Search & Filtering | ✅ Complete |
| 2026-01-01 | Contributor Index         | ✅ Complete |
| 2026-01-01 | Print-Friendly Styles     | ✅ Complete |
| 2026-01-01 | Category Browse Page      | ✅ Complete |
| 2026-01-01 | Related Recipes           | ✅ Complete |
