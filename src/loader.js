import LANGUAGES from '@codewarstools/codewars-languages';
import error from '@codewarstools/scraper-errors';

import * as constants from './constants.js';
import * as selectors from './selectors.js';
import * as solutionResult from './solution-result.js';

import { launchBrowser } from './browser.js';
import { createSolution } from './solution.js';
import { createSolutionManager } from './solution-manager.js';
import { createSolutionResult } from './solution-result.js';
import { createUrlGenerator } from './url-generator.js';
import { createValidateToken } from './validateToken.js';
import { createAuthentication } from './authentication.js';
import { isNetworkError } from './utils/isNetworkError.js';
import { errorResult } from './errorResult.js';


const authenticate = createAuthentication({
  AUTH_COOKIE: constants.AUTH_COOKIE,
  validate: createValidateToken(error),
});

const getSolution = createSolution({
  isNetworkError,
  error,
  ...constants,
  ...selectors,
});
              

const buildSolutionUrls = createUrlGenerator({
  error,
  BASE_URL: constants.BASE_URL,
  SUPPORTED_LANGUAGES: LANGUAGES,
  createSolutionResult,
});


export const getSolutions = createSolutionManager({
  launchBrowser,
  authenticate,
  getSolution,
  buildSolutionUrls,
  errorResult,
  createSolutionResult,
});
