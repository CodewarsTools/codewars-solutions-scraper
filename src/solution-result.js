export const createSolutionResult = ({
  url = '',
  kataId = '',
  language = '',
  success = false,
  data = [],
  error = [],
} = {}) => { 
  return Object.preventExtensions(
    Object.assign(Object.create(null), {
      url,
      kataId,
      language,
      success,
      data,
      error,
    }),
  );
};