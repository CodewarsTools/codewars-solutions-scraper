export const createValidateToken = (error) => {
  return (token) => {

    if (typeof token !== 'string') {
      throw error('INVALID_TOKEN_TYPE');
    }

    if (!token.trim()) {
      throw error('EMPTY_TOKEN');
    }

    if (/\s/.test(token)) {
      throw error('INVALID_TOKEN_CHARACTERS');
    }

  };
};