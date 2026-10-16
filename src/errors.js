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

export const createScraperError = (options) =>
  new ScraperError(options);

const isNetworkError = (error) => {
  const message = `${error?.message ?? error}`;
  const causeMessage = error?.cause?.message ?? '';

  return NETWORK_ERROR_PATTERNS.some(
    (pattern) =>
      message.includes(pattern) ||
      causeMessage.includes(pattern),
  );
};

export const createAuthenticationRequiredError = () =>
  createScraperError({
    code: ERROR_CODES.AUTHENTICATION_REQUIRED,
    message:
      'Authentication is required. Provide a valid remember_user_token.',
  });

export const createAuthenticationFailedError = (cause) =>
  createScraperError({
    code: ERROR_CODES.AUTHENTICATION_FAILED,
    message: 'Authentication failed. Check your remember_user_token.',
    cause,
  });

export const createSolutionsLockedError = () =>
  createScraperError({
    code: ERROR_CODES.SOLUTIONS_LOCKED,
    message:
      'Solutions are locked. This may be because you have not solved this kata yet. Unlocking the solutions will forfeit your eligibility for this kata.',
  });

export const createNetworkError = (cause) =>
  createScraperError({
    code: ERROR_CODES.NETWORK_ERROR,
    message: `Failed to navigate to the solution page: ${cause?.message ?? cause}`,
    cause,
  });

export const createNavigationTimeoutError = (cause) =>
  createScraperError({
    code: ERROR_CODES.NAVIGATION_TIMEOUT,
    message: 'Navigation timed out after 30000 ms',
    cause,
  });

export const createNavigationFailedError = (cause) =>
  createScraperError({
    code: ERROR_CODES.NAVIGATION_FAILED,
    message: 'Failed to navigate to the solution page',
    cause,
  });

export const createNavigationError = (cause) => {
  if (cause?.name === 'TimeoutError') {
    return createNavigationTimeoutError(cause);
  }

  if (isNetworkError(cause)) {
    return createNetworkError(cause);
  }

  return createNavigationFailedError(cause);
};

export const createSolutionNotFoundError = (cause) =>
  createScraperError({
    code: ERROR_CODES.SOLUTION_NOT_FOUND,
    message: 'Solution not found',
    cause,
  });

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
