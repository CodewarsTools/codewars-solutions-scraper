export function createSolutionResult({
  url = '',
  kataId = '',
  language = '',
  success = false,
  data = [],
  error = [],
} = {}) {
  return {
    url,
    kataId,
    language,
    success,
    data,
    error,
  };
}
