import LANGUAGES from '@codewarstools/codewars-languages';

import ERRORS from './errors/errors.json' with { type: 'json' };

import * as constants from './constants.js';
import * as errors from './errors.js';
import * as selectors from './selectors.js';
import * as solutionResult from './solution-result.js';

import { launchBrowser } from './browser.js';
import { createAuthentication } from './authentication.js';
import { createSolution } from './solution.js';
import { createSolutionManager } from './solution-manager.js';
import { createUrlGenerator } from './url-generator.js';
import { createValidateToken } from './validateToken.js';

import { ScraperError } from './errors.js';

const authenticate = createAuthentication({
  AUTH_COOKIE: constants.AUTH_COOKIE,
  validate: createValidateToken({ ERRORS, ScraperError }),
});

const getSolution = createSolution({
  createNavigationError: errors.createNavigationError,
  createAuthenticationFailedError: errors.createAuthenticationFailedError,
  createSolutionsLockedError: errors.createSolutionsLockedError,
  createSolutionNotFoundError: errors.createSolutionNotFoundError,
  NAVIGATION_TIMEOUT: constants.NAVIGATION_TIMEOUT,
  SOLUTION_SELECTOR_TIMEOUT: constants.SOLUTION_SELECTOR_TIMEOUT,
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