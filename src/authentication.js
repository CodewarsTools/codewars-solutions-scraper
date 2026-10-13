import { createAuthenticationRequiredError } from './errors.js';
import { AUTH_COOKIE } from './constants.js';

function validateToken(token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw createAuthenticationRequiredError();
  }
}

export async function authenticate(page, token) {
  validateToken(token);

  await page.setCookie({
    ...AUTH_COOKIE,
    value: token,
  });
}
