export const createUrlGenerator = ({
  error,
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
        throw error('INVALID_ITEM');
      }

      const { kataId, language } = item;

      if (typeof kataId === 'string' && kataId.trim()) {
        result.kataId = kataId;
      }

      if (typeof language === 'string') {
        result.language = language;
      }

      if (typeof kataId !== 'string') {
        throw error('INVALID_KATA_ID_TYPE');
      }

      if (!kataId.trim()) {
        throw error('EMPTY_KATA_ID');
      }

      if (typeof language !== 'string') {
        throw error('INVALID_LANGUAGE_TYPE');
      }

      if (!language.trim()) {
        throw error('EMPTY_LANGUAGE');
      }

      if (language !== language.toLowerCase()) {
        throw error('INVALID_LANGUAGE_CASE');
      }

      if (!/^[a-z]+$/.test(language)) {
        throw error('INVALID_LANGUAGE_FORMAT');
      }

      if (!SUPPORTED_LANGUAGES.includes(language)) {
        throw error('UNSUPPORTED_LANGUAGE');
      }

      result.url =
        `${BASE_URL}/kata/${kataId}/solutions/${language}?filter=me`;
    } catch (cause) {
      result.error.push({
        code: cause.code,
        message: cause.message,
      });
    }

    return result;
  };

  const buildSolutionUrls = (items) => {
    if (!Array.isArray(items)) {
      throw error('INVALID_INPUT');
    }

    return items.map(buildSolutionUrl);
  };

  return buildSolutionUrls;
};
