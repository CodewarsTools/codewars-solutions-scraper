export const BASE_URL = 'https://www.codewars.com';
export const CODEWARS_HOSTNAME = new URL(BASE_URL).hostname;

export const TOKEN_NAME = 'remember_user_token';

export const AUTH_COOKIE = {
  name: TOKEN_NAME,
  domain: CODEWARS_HOSTNAME,
  path: '/',
  secure: true,
};

export const NAVIGATION_TIMEOUT = 30_000;
export const SOLUTION_SELECTOR_TIMEOUT = 10_000;