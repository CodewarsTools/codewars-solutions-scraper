import { getSolutions } from './src/index.js';

const urls = [
  {
    kataId: '54521e9ec8e60bc4de000d6c',
    language: 'javascript',
  },
  {
    kataId: '5a0d38c9697598b67a000041',
    language: 'python',
  },
];
try {
const results = await getSolutions(urls, {
  rememberUserToken: 'eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaGJDRnNHU1NJZE5qVTBNVFJsTXpFeVl6VTRaREV4TlRFNVpESmhZVE14QmpvR1JWUkpJaGswUkZWaVVrNXphSEkxWWpKS2VrZ3pMVGcwZHdZN0FFWkpJaGN4TnpreE9URTJNRGN6TGpFeU1qUXdNemtHT3dCRyIsImV4cCI6IjIwMjctMTAtMTNUMTg6Mjc6NTMuMTIyWiIsInB1ciI6bnVsbH19--45b8c3e4ac22548b87ed2a38a05e34927976a0b7',
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
