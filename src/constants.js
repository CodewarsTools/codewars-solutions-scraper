export const BASE_URL = 'https://www.codewars.com';
export const CODEWARS_HOSTNAME = new URL(BASE_URL).hostname;

export const TOKEN_NAME = 'remember_user_token';

export const AUTH_COOKIE = {
  name: TOKEN_NAME,
  domain: CODEWARS_HOSTNAME,
  path: '/',
  secure: true,
};