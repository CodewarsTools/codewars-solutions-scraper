
import { getSolutions } from './src/index.js';

const urls = [
  'https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/python?filter=me',
  'https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/javascript?filter=me',
  'https://www.codewars.com/kata/5a0d38c9697598b67a000041/solutions/javascript?filter=me',
];

try {
  const results = await getSolutions(urls, {
    rememberUserToken: 'ssfsfa',
    browser: {
      headless: false,
    },
  });

  console.dir(results, { depth: null });
} catch (error) {
  console.error('Failed to process solutions:', error);
}

