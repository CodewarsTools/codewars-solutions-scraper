import { createAuthenticationRequiredError } from './errors.js';
import { AUTH_COOKIE } from './constants.js';

export async function authenticate(page, token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw createAuthenticationRequiredError();
  }

  await page.setCookie({
    ...AUTH_COOKIE,
    value: token,
  });
}