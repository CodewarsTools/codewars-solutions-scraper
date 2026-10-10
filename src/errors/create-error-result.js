
import { ERROR_CODES } from './error-codes.js';
import { ScraperError } from './scraper-error.js';

export function createErrorResult(error) {
  if (error instanceof ScraperError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (error?.name === 'TimeoutError') {
    return {
      code: ERROR_CODES.NAVIGATION_FAILED,
      message: error.message,
    };
  }

  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error instanceof Error
      ? error.message
      : String(error),
  };
}
