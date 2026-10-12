import { ERROR_CODES, createScraperError } from "./errors.js";

import { SOLUTION_SELECTOR, SOLUTIONS_LOCKED_SELECTOR, SIGN_IN_SELECTOR } from "./selectors.js";

const {
  NAVIGATION_FAILED,
  SOLUTIONS_LOCKED,
  SOLUTION_NOT_FOUND,
  AUTHENTICATION_FAILED,
} = ERROR_CODES;

export async function getSolution(page, url) {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
  } catch (cause) {
    throw createScraperError({
      code: NAVIGATION_FAILED,
      message: "Failed to navigate to the solution page",
      cause,
    });
  }

  const authenticationFailed = await page.$(SIGN_IN_SELECTOR);

  if (authenticationFailed) {
    throw createScraperError({
      code: AUTHENTICATION_FAILED,
      message: "Authentication failed. Check your remember_user_token.",
    });
  }

  const solutionsLocked = await page.$(SOLUTIONS_LOCKED_SELECTOR);

  if (solutionsLocked) {
    throw createScraperError({
      code: SOLUTIONS_LOCKED,
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
      code: SOLUTION_NOT_FOUND,
      message: "Solution not found",
      cause,
    });
  }

  return page.$eval(SOLUTION_SELECTOR, (element) => element.textContent);
}