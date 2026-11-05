export const createError = ({ ERRORS, ScraperError }) => {
  return (code, { cause } = {}) => {
    return new ScraperError({
      code,
      message: ERRORS[code] ?? code,
      cause,
    });
  };
};