export const createUrlGenerator = ({
  BASE_URL,
  SUPPORTED_LANGUAGES,
  ERROR_CODES,
  createSolutionResult,
}) => {
  const buildSolutionUrl = (item) => {
    const result = createSolutionResult();

    try {
      if (
        typeof item !== 'object' ||
        item === null ||
        Array.isArray(item)
      ) {
        throw new TypeError(
          `Invalid item "${String(item)}": expected an object`,
        );
      }

      const { kataId, language } = item;

      if (typeof kataId === 'string' && kataId.trim()) {
        result.kataId = kataId;
      }

      if (typeof language === 'string') {
        result.language = language;
      } else if (language !== undefined && language !== null) {
        result.error.push({
          code: ERROR_CODES.INVALID_INPUT,
          message: `Invalid language: expected a non-empty string, received ${
            Array.isArray(language) ? 'array' : typeof language
          } (${JSON.stringify(language)})`,
        });

        return result;
      }

      if (typeof kataId !== 'string' || !kataId.trim()) {
        throw new TypeError(
          `Invalid kataId "${String(kataId)}": expected a non-empty string`,
        );
      }

      if (typeof language !== 'string' || !language.trim()) {
        throw new TypeError(
          `Invalid language "${String(language)}": expected a non-empty string`,
        );
      }

      if (language !== language.toLowerCase()) {
        const error = new TypeError(
          `Invalid language "${language}": expected a lowercase language identifier`,
        );

        error.code = ERROR_CODES.INVALID_LANGUAGE_CASE;
        throw error;
      }

      if (!/^[a-z]+$/.test(language)) {
        const error = new TypeError(
          `Invalid language "${language}": expected lowercase letters a-z only`,
        );

        error.code = ERROR_CODES.INVALID_INPUT;
        throw error;
      }

      if (!SUPPORTED_LANGUAGES.includes(language)) {
        const error = new RangeError(
          `Unsupported language "${language}".`,
        );

        error.code = ERROR_CODES.UNSUPPORTED_LANGUAGE;
        throw error;
      }

      result.url =
        `${BASE_URL}/kata/${kataId}/solutions/${language}?filter=me`;
    } catch (error) {
      result.error.push({
        code: error.code ?? ERROR_CODES.INVALID_INPUT,
        message: error.message,
      });
    }

    return result;
  };

  const buildSolutionUrls = (items) => {
    if (!Array.isArray(items)) {
      throw new TypeError(
        `Invalid items "${String(items)}": expected an array`,
      );
    }

    return items.map(buildSolutionUrl);
  };

  return buildSolutionUrls;
};