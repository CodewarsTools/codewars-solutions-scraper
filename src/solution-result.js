export const createSolutionResult = ({
  url = '',
  kataId = '',
  language = '',
  success = false,
  data = [],
  error = [],
} = {}) => ({
  url,
  kataId,
  language,
  success,
  data,
  error,
});