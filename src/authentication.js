import {
  ERROR_CODES,
  createAuthenticationRequiredError,
} from './errors.js';

export async function authenticate(page, token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw createAuthenticationRequiredError();
  }

  await page.setCookie({
    name: 'remember_user_token',
    value: token,
    domain: 'www.codewars.com',
    path: '/',
    secure: true,
  });
}