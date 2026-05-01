/**
 * Project ordering for the portfolio grid (featured vs full list).
 * Keep titles in sync with `projects[].title` in `src/data/portfolio.ts`.
 */

export const FEATURED_PROJECT_TITLES = [
  'SmartAir Health',
  'Clippy',
  'Wine Quality Regression',
] as const

/** Shown first in "All Projects" immediately after the featured trio. */
export const PRIORITIZED_AFTER_FEATURED_TITLES = ['AI Course Planner UofT'] as const

export const PRIORITIZED_ALL_TITLE_ORDER = [
  ...FEATURED_PROJECT_TITLES,
  ...PRIORITIZED_AFTER_FEATURED_TITLES,
] as const
