export const createError = ({ ERRORS, ScraperError }) => {
  return (code, { cause, message } = {}) => {
    return new ScraperError({
      code,
      message: ERRORS[code] ?? message ?? code,
      cause,
    });
  };
};