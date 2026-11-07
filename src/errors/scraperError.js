export class ScraperError extends Error {
  constructor({ code, message, cause } = {}) {
    super(message, { cause });

    this.name = 'ScraperError';
    this.code = code;
  }
}
