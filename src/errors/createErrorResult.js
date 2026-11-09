export const createErrorResult = ({ ScraperError, ERRORS }) => {
  return (cause) => {
    if (cause instanceof ScraperError) {
      return {
        code: cause.code,
        message: cause.message,
      };
    }

    return {
      code: ERRORS.UNKNOWN_ERROR,
      message: cause instanceof Error
        ? cause.message
        : String(cause),
    };
  };
};