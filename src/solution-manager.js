export function createSolutionManager({
  launchBrowser,
  authenticate,
  getSolution,
  buildSolutionUrls,
  createErrorResult,
}) {
  async function processUrl(page, item, url) {
    const { kataId, language } = item;

    try {
      const solution = await getSolution(page, url);

      return {
        url,
        kataId,
        language,
        success: true,
        data: {
          solution,
        },
        error: null,
      };
    } catch (error) {
      return {
        url,
        kataId,
        language,
        success: false,
        data: null,
        error: createErrorResult(error),
      };
    }
  }

  return async function getSolutions(items, options = {}) {
    if (!Array.isArray(items)) {
      throw new TypeError('Items must be an array');
    }

    if (items.length === 0) {
      return [];
    }

    const urls = buildSolutionUrls(items);
    const browser = await launchBrowser(options.browser);

    try {
      const page = await browser.newPage();

      try {
        await authenticate(page, options.rememberUserToken);
      } catch (error) {
        const authError = createErrorResult(error);

        return items.map((item, index) => ({
          url: urls[index],
          kataId: item.kataId,
          language: item.language,
          success: false,
          data: null,
          error: authError,
        }));
      }

      const results = [];

      for (let index = 0; index < items.length; index++) {
        results.push(
          await processUrl(page, items[index], urls[index]),
        );
      }

      return results;
    } finally {
      await browser.close();
    }
  };
}