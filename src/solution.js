export const createSolution = ({
  createNavigationError,
  createAuthenticationFailedError,
  createSolutionsLockedError,
  createSolutionNotFoundError,
  SOLUTION_SELECTOR,
  SOLUTIONS_LOCKED_SELECTOR,
  SIGN_IN_SELECTOR,
}) => {
  const getSolution = async (page, url) => {
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
    } catch (cause) {
      throw createNavigationError(cause);
    }

    if (await page.$(SIGN_IN_SELECTOR)) {
      throw createAuthenticationFailedError();
    }

    if (await page.$(SOLUTIONS_LOCKED_SELECTOR)) {
      throw createSolutionsLockedError();
    }

    try {
      await page.waitForSelector(SOLUTION_SELECTOR, {
        timeout: 10_000,
      });
    } catch (cause) {
      if (cause?.name !== 'TimeoutError') {
        throw cause;
      }

      throw createSolutionNotFoundError(cause);
    }

    return page.$eval(SOLUTION_SELECTOR, (element) => element.textContent);
  };

  return getSolution;
};