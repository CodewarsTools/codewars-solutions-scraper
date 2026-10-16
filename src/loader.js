import LANGUAGES from '@codewarstools/codewars-languages';

import * as constants from './constants.js';
import * as errors from './errors.js';
import * as selectors from './selectors.js';
import * as solutionResult from './solution-result.js';

import { launchBrowser } from './browser.js';
import { createAuthentication } from './authentication.js';
import { createSolution } from './solution.js';
import { createSolutionManager } from './solution-manager.js';
import { createUrlGenerator } from './url-generator.js';

const authenticate = createAuthentication({
  createAuthenticationRequiredError:
    errors.createAuthenticationRequiredError,
  AUTH_COOKIE: constants.AUTH_COOKIE,
});

const getSolution = createSolution({
  createNavigationError: errors.createNavigationError,
  createAuthenticationFailedError: errors.createAuthenticationFailedError,
  createSolutionsLockedError: errors.createSolutionsLockedError,
  createSolutionNotFoundError: errors.createSolutionNotFoundError,
  ...selectors,
});

const createSolutionResult = solutionResult.createSolutionResult;

const buildSolutionUrls = createUrlGenerator({
  ERROR_CODES: errors.ERROR_CODES,
  BASE_URL: constants.BASE_URL,
  SUPPORTED_LANGUAGES: LANGUAGES,
  createSolutionResult,
});

export const getSolutions = createSolutionManager({
  launchBrowser,
  authenticate,
  getSolution,
  buildSolutionUrls,
  createErrorResult: errors.createErrorResult,
  createSolutionResult,
});
