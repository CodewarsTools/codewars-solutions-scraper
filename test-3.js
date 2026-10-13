import { getSolutions } from './src/index.js';

const urls = [
  'https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/python?filter=me',
  'https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/python?filter=me',
  'https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/javascript?filter=me',
  'https://www.codewars.com/kata/5a0d38c9697598b67a000041/solutions/javascript?filter=me',
];

try {
  const results = await getSolutions(urls, {
    rememberUserToken: 'eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaGJDRnNHU1NJZE5qVTBNVFJsTXpFeVl6VTRaREV4TlRFNVpESmhZVE14QmpvR1JWUkpJaGxoVEdSb2RGTjVValJIUlhReGRVVkVibTB5UmdZN0FGUkpJaGN4TnpreE1Ua3pNREV5TGpNek1qUTJNVGdHT3dCRyIsImV4cCI6IjIwMjctMTAtMDVUMDk6MzY6NTIuMzMyWiIsInB1ciI6bnVsbH19--f8bff6128b5cc131f5f316db6429a84437954221',
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
