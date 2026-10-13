export function createUrlGenerator({ BASE_URL, SUPORT_LANGUAGES }) {
  function isSupportedLanguage(language) {
    return SUPORT_LANGUAGES.includes(language);
  }

  return function buildSolutionUrls(items) {
    if (!Array.isArray(items)) {
      throw new TypeError('Items must be an array');
    }

    return items.map((item) => {
      if (
        typeof item !== 'object' ||
        item === null ||
        Array.isArray(item)
      ) {
        throw new TypeError('Each item must be an object');
      }

      const { kataId, language } = item;

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

      if (!isSupportedLanguage(language)) {
        throw new RangeError(`Unsupported language: ${language}`);
      }

      return `${BASE_URL}/kata/${kataId}/solutions/${language}?filter=me`;
    });
  };
}