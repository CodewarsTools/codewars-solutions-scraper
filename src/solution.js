export function createSolution({
  ERROR_CODES,
  createScraperError,
  SOLUTION_SELECTOR,
  SOLUTIONS_LOCKED_SELECTOR,
  SIGN_IN_SELECTOR,
}) {
  return async function getSolution(page, url) {
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
    } catch (cause) {
      throw createScraperError({
        code: ERROR_CODES.NAVIGATION_FAILED,
        message: 'Failed to navigate to the solution page',
        cause,
      });
    }

    if (await page.$(SIGN_IN_SELECTOR)) {
      throw createScraperError({
        code: ERROR_CODES.AUTHENTICATION_FAILED,
        message: 'Authentication failed. Check your remember_user_token.',
      });
    }

    if (await page.$(SOLUTIONS_LOCKED_SELECTOR)) {
      throw createScraperError({
        code: ERROR_CODES.SOLUTIONS_LOCKED,
        message:
          'Solutions are locked. This may be because you have not solved this kata yet. Unlocking the solutions will forfeit your eligibility for this kata.',
      });
    }

    try {
      await page.waitForSelector(SOLUTION_SELECTOR, {
        timeout: 10_000,
      });
    } catch (cause) {
      if (cause?.name !== 'TimeoutError') {
        throw cause;
      }

      throw createScraperError({
        code: ERROR_CODES.SOLUTION_NOT_FOUND,
        message: 'Solution not found',
        cause,
      });
    }

    return page.$eval(SOLUTION_SELECTOR, (element) => element.textContent);
  };
}