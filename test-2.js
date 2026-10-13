import { getSolutions } from './src/index.js';

const urls = [
  'https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/python?filter=me',
];

try {
  const results = await getSolutions(urls, {
    rememberUserToken: '',
    browser: {
      headless: false,
    },
  });

  console.dir(results, { depth: null });
} catch (error) {
  if (error.code === 'AUTHENTICATION_REQUIRED') {
    console.error(error.message);
  } else {
    console.error('Failed to process solutions:', error);
  }
}
