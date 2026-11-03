export const createValidateToken = ({ ERRORS, ScraperError }) => {
  return (token) => {
    const invalidType = 'INVALID_TOKEN_TYPE';
    const empty = 'EMPTY_TOKEN';
    const invalidChars = 'INVALID_TOKEN_CHARACTERS';

    if (typeof token !== 'string') {
      throw new ScraperError({
        code: invalidType,
        message: ERRORS[invalidType],
      });
    }

    if (!token.trim()) {
      throw new ScraperError({
        code: empty,
        message: ERRORS[empty],
      });
    }

    if (/\s/.test(token)) {
      throw new ScraperError({
        code: invalidChars,
        message: ERRORS[invalidChars],
      });
    }
  };
};