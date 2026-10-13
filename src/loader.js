import LANGUAGES from '@codewarstools/codewars-languages';

import * as constants from './constants.js';
import * as errors from './errors.js';
import * as selectors from './selectors.js';

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
  ERROR_CODES: errors.ERROR_CODES,
  createScraperError: errors.createScraperError,
  ...selectors,
});

const buildSolutionUrls = createUrlGenerator({
  BASE_URL: constants.BASE_URL,
  SUPORT_LANGUAGES: LANGUAGES,
});

export const getSolutions = createSolutionManager({
  launchBrowser,
  authenticate,
  getSolution,
  buildSolutionUrls,
  createErrorResult: errors.createErrorResult,
});