/**
 * Project ordering for the portfolio grid (featured vs full list).
 * Keep titles in sync with `projects[].title` in `src/data/portfolio.ts`.
 */

export const FEATURED_PROJECT_TITLES = [
  'Pada Guidance',
  'SmartAir Health',
  'Wine Quality Regression',
] as const

/** Shown first in "All Projects" immediately after the featured projects. */
export const PRIORITIZED_AFTER_FEATURED_TITLES = [
  'Okra',
  'Clippy',
  'AI Course Planner UofT',
] as const

export const PRIORITIZED_ALL_TITLE_ORDER = [
  ...FEATURED_PROJECT_TITLES,
  ...PRIORITIZED_AFTER_FEATURED_TITLES,
] as const
