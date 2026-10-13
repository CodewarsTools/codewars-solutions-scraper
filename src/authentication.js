export function createAuthentication({
  createAuthenticationRequiredError,
  AUTH_COOKIE,
}) {
  function validateToken(token) {
    if (typeof token !== 'string' || !token.trim()) {
      throw createAuthenticationRequiredError();
    }
  }

  return async function authenticate(page, token) {
    validateToken(token);

    await page.setCookie({
      ...AUTH_COOKIE,
      value: token,
    });
  };
}