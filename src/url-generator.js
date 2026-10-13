export const createUrlGenerator = ({
  BASE_URL,
  SUPPORTED_LANGUAGES,
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
        throw new TypeError('Each item must be an object');
      }

      const { kataId, language } = item;

      if (typeof kataId === 'string' && kataId.trim()) {
        result.kataId = kataId;
      }

      if (typeof language === 'string') {
        result.language = language;
      }

      if (typeof kataId !== 'string' || !kataId.trim()) {
        throw new TypeError(
          'Invalid kataId: expected a non-empty string',
        );
      }

      if (typeof language !== 'string' || !language.trim()) {
        throw new TypeError(
          'Invalid language: expected a non-empty string',
        );
      }

      if (!SUPPORTED_LANGUAGES.includes(language)) {
        const error = new RangeError(
          `Unsupported language: ${language}`,
        );

        error.code = 'UNSUPPORTED_LANGUAGE';
        throw error;
      }

      result.url =
        `${BASE_URL}/kata/${kataId}/solutions/${language}?filter=me`;
    } catch (error) {
      result.error.push({
        code: error.code ?? 'INVALID_INPUT',
        message: error.message,
      });
    }

    return result;
  };

  const buildSolutionUrls = (items) => {
    if (!Array.isArray(items)) {
      throw new TypeError('Items must be an array');
    }

    return items.map(buildSolutionUrl);
  };
  
  return buildSolutionUrls;

};