import { ScraperError } from './scraperError.js';
import ERRORS from './errors.json' with { type: 'json' };

import { createError } from './createError.js';
import { createErrorResult } from './createErrorResult.js';

const dependencies = { ERRORS, ScraperError };

const error = createError(dependencies);
const errorResult = createErrorResult(dependencies);

export { error, errorResult };