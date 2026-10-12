import { ERROR_CODES, createScraperError } from "./errors/index.js";

import { SOLUTION_SELECTOR, SOLUTIONS_LOCKED_SELECTOR } from "./selectors.js";

export async function getSolution(page, url) {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
  } catch (cause) {
    throw createScraperError({
      code: ERROR_CODES.NAVIGATION_FAILED,
      message: "Failed to navigate to the solution page",
      cause,
    });
  }

  const solutionsLocked = await page.$(SOLUTIONS_LOCKED_SELECTOR);

  if (solutionsLocked) {
    throw createScraperError({
      code: ERROR_CODES.SOLUTIONS_LOCKED,
      message:
        "Solutions are locked. This may be because you have not solved this kata yet. Unlocking the solutions will forfeit your eligibility for this kata.",
    });
  }

  try {
    await page.waitForSelector(SOLUTION_SELECTOR, {
      timeout: 10_000,
    });
  } catch (cause) {
    if (cause?.name !== "TimeoutError") {
      throw cause;
    }

    throw createScraperError({
      code: ERROR_CODES.SOLUTION_NOT_FOUND,
      message: "Solution not found",
      cause,
    });
  }

  return page.$eval(SOLUTION_SELECTOR, (element) => element.textContent);
}
