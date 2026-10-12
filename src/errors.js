export const ERROR_CODES = Object.freeze({
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  INVALID_URL: 'INVALID_URL',
  SOLUTIONS_LOCKED: 'SOLUTIONS_LOCKED',
  SOLUTION_NOT_FOUND: 'SOLUTION_NOT_FOUND',
  NAVIGATION_FAILED: 'NAVIGATION_FAILED',
  BROWSER_LAUNCH_FAILED: 'BROWSER_LAUNCH_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
});

export class ScraperError extends Error {
  constructor({ code, message, cause } = {}) {
    super(message, { cause });

    this.name = 'ScraperError';
    this.code = code;
  }
}

export function createScraperError(options) {
  return new ScraperError(options);
}

export function createAuthenticationRequiredError() {
  return createScraperError({
    code: ERROR_CODES.AUTHENTICATION_REQUIRED,
    message:
      'Authentication is required. Provide a valid remember_user_token.',
  });
}

export function createAuthenticationFailedError(cause) {
  return createScraperError({
    code: ERROR_CODES.AUTHENTICATION_FAILED,
    message: 'Authentication failed. Check your remember_user_token.',
    cause,
  });
}

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