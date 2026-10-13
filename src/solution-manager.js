export function createSolutionManager({
  launchBrowser,
  authenticate,
  getSolution,
  buildSolutionUrls,
  createErrorResult,
  createSolutionResult,
}) {
  async function processUrl(page, item) {
    try {
      const solution = await getSolution(page, item.url);

      return createSolutionResult({
        ...item,
        success: true,
        data: [solution],
        error: [],
      });
    } catch (error) {
      return createSolutionResult({
        ...item,
        success: false,
        data: [],
        error: [createErrorResult(error)],
      });
    }
  }

  return async function getSolutions(items, options = {}) {
    if (!Array.isArray(items)) {
      throw new TypeError('Items must be an array');
    }

    if (items.length === 0) {
      return [];
    }

    const results = buildSolutionUrls(items);

    const hasValidResults = results.some(
      (result) => result.url && result.error.length === 0,
    );

    if (!hasValidResults) {
      return results;
    }

    const browser = await launchBrowser(options.browser);

    try {
      const page = await browser.newPage();

      try {
        await authenticate(page, options.rememberUserToken);
      } catch (error) {
        const authError = createErrorResult(error);

        return results.map((result) => {
          if (!result.url || result.error.length > 0) {
            return result;
          }

          return createSolutionResult({
            ...result,
            success: false,
            data: [],
            error: [{ ...authError }],
          });
        });
      }

      const processedResults = [];

      for (const result of results) {
        if (!result.url || result.error.length > 0) {
          processedResults.push(result);
          continue;
        }

        processedResults.push(await processUrl(page, result));
      }

      return processedResults;
    } finally {
      await browser.close();
    }
  };
}