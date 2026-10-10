import {
  ERROR_CODES,
  createScraperError,
} from './errors/index.js';

const SOLUTION_SELECTOR = '#solutions_list pre code';
const SOLUTIONS_LOCKED_SELECTOR = '.js-unlock-solutions';

export async function getSolution(page, url) {
  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
  } catch (cause) {
    throw createScraperError(
      ERROR_CODES.NAVIGATION_FAILED,
      'Failed to navigate to the solution page',
      { cause },
    );
  }

  const solutionsLocked = await page.$(SOLUTIONS_LOCKED_SELECTOR);

  if (solutionsLocked) {
    throw createScraperError(
      ERROR_CODES.SOLUTIONS_LOCKED,
      'Solutions are locked. This may be because you have not solved this kata yet. Unlocking the solutions will forfeit your eligibility for this kata.',
    );
  }

  try {
    await page.waitForSelector(SOLUTION_SELECTOR, {
      timeout: 10_000,
    });
  } catch (cause) {
    if (cause?.name !== 'TimeoutError') {
      throw cause;
    }

    throw createScraperError(
      ERROR_CODES.SOLUTION_NOT_FOUND,
      'Solution not found',
      { cause },
    );
  }

  return page.$eval(
    SOLUTION_SELECTOR,
    (element) => element.textContent,
  );
}