export const ERROR_CODES = Object.freeze(
  Object.assign(Object.create(null), {
    NETWORK_ERROR: 'NETWORK_ERROR',
    NAVIGATION_TIMEOUT: 'NAVIGATION_TIMEOUT',
    NAVIGATION_FAILED: 'NAVIGATION_FAILED',
    AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    BROWSER_LAUNCH_FAILED: 'BROWSER_LAUNCH_FAILED',
    INVALID_URL: 'INVALID_URL',
    INVALID_INPUT: 'INVALID_INPUT',
    INVALID_LANGUAGE_CASE: 'INVALID_LANGUAGE_CASE',
    UNSUPPORTED_LANGUAGE: 'UNSUPPORTED_LANGUAGE',
    SOLUTIONS_LOCKED: 'SOLUTIONS_LOCKED',
    SOLUTION_NOT_FOUND: 'SOLUTION_NOT_FOUND',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  }),
);

const NETWORK_ERROR_PATTERNS = Object.freeze([
  'net::ERR_NAME_NOT_RESOLVED',
  'net::ERR_INTERNET_DISCONNECTED',
  'net::ERR_NETWORK_CHANGED',
  'net::ERR_ADDRESS_UNREACHABLE',
  'net::ERR_CONNECTION_REFUSED',
  'net::ERR_CONNECTION_RESET',
  'net::ERR_CONNECTION_TIMED_OUT',
]);

export class ScraperError extends Error {
  constructor({ code, message, cause } = {}) {
    super(message, { cause });

    this.name = 'ScraperError';
    this.code = code;
  }
}

import { createError } from './errors/createError.js';
import error_code from './errors/errors.json' with { type: 'json' };

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


export const createNetworkError = (cause) => {
  return createScraperError({
    code: ERROR_CODES,
    message: `Failed to navigate to the solution page: ${cause?.message ?? cause}`,
    cause,
  })
};

export const createNavigationTimeoutError = (
  cause,
  NAVIGATION_TIMEOUT,
) => { 
  return error('NAVIGATION_TIMEOUT', { cause });
}

export const createNavigationFailedError = (cause) =>
  createScraperError({
    code: ERROR_CODES.NAVIGATION_FAILED,
    message: 'Failed to navigate to the solution page',
    cause,
  });

export const createNavigationError = (
  cause,
  NAVIGATION_TIMEOUT,
) => {
  if (cause?.name === 'TimeoutError') {
    return error('NAVIGATION_TIMEOUT', { cause });
  }

  if (isNetworkError(cause)) {
    return createNetworkError(cause);
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

  if (isNetworkError(error)) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: `Network error: ${error?.message ?? error}`,
    };
  }

  if (error?.name === 'TimeoutError') {
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
    };
  }

  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error instanceof Error
      ? error.message
      : String(error),
  };
};
