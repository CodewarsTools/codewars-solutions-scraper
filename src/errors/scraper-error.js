
export class ScraperError extends Error {
  constructor(code, message, options = {}) {
    super(message, options);

    this.name = 'ScraperError';
    this.code = code;
  }
}

export function createScraperError(code, message, options = {}) {
  return new ScraperError(code, message, options);
}
