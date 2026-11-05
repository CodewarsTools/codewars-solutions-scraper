export const createError = ({ ERRORS, ScraperError }) => {
  return (code) => {
    return new ScraperError({
      code,
      message: ERRORS[code] ?? code,
    });
  };
};