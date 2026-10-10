
export async function authenticate(page, token) {
  if (!token) {
    return;
  }

  await page.setCookie({
    name: 'remember_user_token',
    value: token,
    domain: 'www.codewars.com',
    path: '/',
    secure: true,
  });
}
