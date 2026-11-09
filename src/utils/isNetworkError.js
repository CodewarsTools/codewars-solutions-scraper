export const isNetworkError = (error) => {
  const pattern = 'net::';
  const message = `${error?.message ?? error}`;
  const causeMessage = error?.cause?.message ?? '';

  return message.includes(pattern) || causeMessage.includes(pattern);
};
