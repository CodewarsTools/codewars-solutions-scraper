import puppeteer from 'puppeteer';

export const launchBrowser = (options = {}) => {
  return puppeteer.launch({
    headless: true,
    ...options,
  });
};
