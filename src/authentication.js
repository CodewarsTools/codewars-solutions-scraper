export const createAuthentication = ({
  AUTH_COOKIE,
  validate,
}) => {
  const authenticate = async (page, token) => {

    validate(token);

    await page.setCookie({
      ...AUTH_COOKIE,
      value: token,
    });
  };

  return authenticate;
};