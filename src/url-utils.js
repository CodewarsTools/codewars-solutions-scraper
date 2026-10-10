
import {
  ERROR_CODES,
  createScraperError,
} from './errors/index.js';

const SOLUTION_URL_PATTERN =
  /^\/kata\/([a-f\d]{24})\/solutions\/([a-z\d-]+)\/?$/i;

export function parseSolutionUrl(value) {
  if (typeof value !== 'string') {
    throw createScraperError(
      ERROR_CODES.INVALID_URL,
      'URL must be a string',
    );
  }

  let url;

  try {
    url = new URL(value);
  } catch (cause) {
    throw createScraperError(
      ERROR_CODES.INVALID_URL,
      'Invalid URL format',
      { cause },
    );
  }

  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'www.codewars.com'
  ) {
    throw createScraperError(
      ERROR_CODES.INVALID_URL,
      'URL must belong to https://www.codewars.com',
    );
  }

  const match = url.pathname.match(SOLUTION_URL_PATTERN);

  if (!match) {
    throw createScraperError(
      ERROR_CODES.INVALID_URL,
      'Invalid Codewars solution URL',
    );
  }

  return {
    kataId: match[1],
    language: match[2],
  };
}
