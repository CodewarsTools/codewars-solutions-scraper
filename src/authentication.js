export const createAuthentication = ({
  createAuthenticationRequiredError,
  AUTH_COOKIE,
}) => {
  const validateToken = (token) => {
    if (typeof token !== 'string' || !token.trim()) {
      throw createAuthenticationRequiredError();
    }
  };

  const authenticate = async (page, token) => {
    validateToken(token);

    await page.setCookie({
      ...AUTH_COOKIE,
      value: token,
    });
  };

  return authenticate;
};