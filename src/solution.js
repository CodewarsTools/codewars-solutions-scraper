export const createSolution = ({
  error,
  createNavigationError,
  createAuthenticationFailedError,
  createSolutionsLockedError,
  createSolutionNotFoundError,
  NAVIGATION_TIMEOUT,
  SOLUTION_SELECTOR_TIMEOUT,
  SOLUTION_SELECTOR,
  SOLUTIONS_LOCKED_SELECTOR,
  SIGN_IN_SELECTOR,
}) => {
  const getSolution = async (page, url) => {
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: NAVIGATION_TIMEOUT,
      });
    } catch (cause) {
      throw createNavigationError(cause, NAVIGATION_TIMEOUT);
    }

    if (await page.$(SIGN_IN_SELECTOR)) {
      throw error('AUTHENTICATION_FAILED');
    }

    if (await page.$(SOLUTIONS_LOCKED_SELECTOR)) {
      throw error('SOLUTIONS_LOCKED');
    }

    try {
      await page.waitForSelector(SOLUTION_SELECTOR, {
        timeout: SOLUTION_SELECTOR_TIMEOUT,
      });
    } catch (cause) {
      if (cause?.name !== 'TimeoutError') {
        throw cause;
      }
      throw error('SOLUTION_NOT_FOUND', { cause });
    }

    return page.$eval(
      SOLUTION_SELECTOR,
      (element) => element.textContent,
    );
  };

  return getSolution;
};
