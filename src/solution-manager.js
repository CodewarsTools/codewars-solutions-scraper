import {
  launchBrowser,
  authenticate,
  getSolution,
  parseSolutionUrl,
  createErrorResult,
} from './internal.js';

async function processUrl(page, value) {
  const url = typeof value === 'string'
    ? value
    : String(value);

  let metadata = {
    kataId: null,
    language: null,
  };

  try {
    metadata = parseSolutionUrl(value);

    const solution = await getSolution(page, value);

    return {
      url,
      ...metadata,
      success: true,
      data: {
        solution,
      },
      error: null,
    };
  } catch (error) {
    return {
      url,
      ...metadata,
      success: false,
      data: null,
      error: createErrorResult(error),
    };
  }
}

export async function getSolutions(urls, options = {}) {
  if (!Array.isArray(urls)) {
    throw new TypeError('URLs must be an array');
  }

  if (urls.length === 0) {
    return [];
  }

  const browser = await launchBrowser(options.browser);

  try {
    const page = await browser.newPage();

    try {
      await authenticate(page, options.rememberUserToken);
    } catch (cause) {
      throw new Error('Failed to authenticate with Codewars', {
        cause,
      });
    }

    const results = [];

    for (const url of urls) {
      results.push(await processUrl(page, url));
    }

    return results;
  } finally {
    await browser.close();
  }
}