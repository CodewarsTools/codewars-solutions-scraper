
import puppeteer from 'puppeteer';

export function launchBrowser(options = {}) {
  return puppeteer.launch({
    headless: true,
    ...options,
  });
}
