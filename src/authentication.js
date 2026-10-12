import {
  ERROR_CODES,
  createScraperError,
} from './errors.js';

export async function authenticate(page, token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw createScraperError({
      code: ERROR_CODES.AUTHENTICATION_REQUIRED,
      message: 'Authentication is required. Provide a valid remember_user_token.',
    });
  }

  await page.setCookie({
    name: 'remember_user_token',
    value: token,
    domain: 'www.codewars.com',
    path: '/',
    secure: true,
  });
}