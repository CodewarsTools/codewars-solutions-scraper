const NETWORK_ERROR_PATTERNS = Object.freeze([
  'net::ERR_NAME_NOT_RESOLVED',
  'net::ERR_INTERNET_DISCONNECTED',
  'net::ERR_NETWORK_CHANGED',
  'net::ERR_ADDRESS_UNREACHABLE',
  'net::ERR_CONNECTION_REFUSED',
  'net::ERR_CONNECTION_RESET',
  'net::ERR_CONNECTION_TIMED_OUT',
]);

import { createError } from './errors/createError.js';
import error_code from './errors/errors.json' with { type: 'json' };
import { ScraperError } from './errors/scraperError.js';

const error = createError({ ERRORS: error_code, ScraperError });

const isNetworkError = (error) => {
  const message = `${error?.message ?? error}`;
  const causeMessage = error?.cause?.message ?? '';

  return NETWORK_ERROR_PATTERNS.some(
    (pattern) =>
      message.includes(pattern) ||
      causeMessage.includes(pattern),
  );
};

export const createNavigationError = (
  cause,
  NAVIGATION_TIMEOUT,
) => {

  if (cause?.name === 'TimeoutError') {
    return error('NAVIGATION_TIMEOUT', { cause });
  }

  if (isNetworkError(cause)) {
    return error('NETWORK_ERROR', { cause });
  }

  return error('NAVIGATION_FAILED', { cause });
};


export const createErrorResult = (error) => {

  if (error instanceof ScraperError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error instanceof Error
      ? error.message
      : String(error),
  }

};
