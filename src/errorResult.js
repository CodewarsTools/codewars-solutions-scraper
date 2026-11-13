export const errorResult = (cause) => ({
  code: cause?.code ?? 'UNKNOWN_ERROR',
  message: cause?.message ?? String(cause),
});