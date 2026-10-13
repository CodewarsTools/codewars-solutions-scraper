# Codewars Solutions Scraper

A Node.js library for extracting your own solution code from [Codewars](https://www.codewars.com/) using Puppeteer.

## Features

- Extract your own solution code from Codewars.
- Process multiple kata solutions in a single request.
- Support multiple programming languages.
- Authenticate using a Codewars session cookie.
- Handle errors with consistent error codes.
- Return structured results as an array of objects.

## Requirements

- Node.js 20 or later.
- A Codewars account.
- A valid `remember_user_token` cookie.

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/AndriiKot/codewars-solutions-scraper.git
cd codewars-solutions-scraper
npm install
```

## Usage

Import `getSolutions` and provide an array of kata objects, an authentication token, and optional browser settings.

```js
import { getSolutions } from './src/index.js';

const katas = [
  {
    kataId: '54521e9ec8e60bc4de000d6c',
    language: 'javascript',
  },
  {
    kataId: '5a0d38c9697598b67a000041',
    language: 'python',
  },
];

const results = await getSolutions(katas, {
  rememberUserToken: process.env.CODEWARS_TOKEN,
  browser: {
    headless: false,
  },
});

console.dir(results, { depth: null });
```

The library generates solution URLs from the supplied kata IDs and language identifiers.

The example uses the `CODEWARS_TOKEN` environment variable to provide the authentication token. This is a suggested approach, not a requirement. Users are responsible for obtaining the token and supplying it securely.

The `browser.headless` option controls whether the browser runs in headless mode:

- `true` — runs without a visible browser window.
- `false` — displays the browser window.

## Data Format

### Input

The `getSolutions()` function accepts an array of objects. Each object specifies a kata ID and a programming language identifier.

```json
[
  {
    "kataId": "54521e9ec8e60bc4de000d6c",
    "language": "javascript"
  },
  {
    "kataId": "5a0d38c9697598b67a000041",
    "language": "python"
  }
]
```

### Output

The function returns an array containing one result object for each input item. Each result has the following structure:

```json
{
  "url": "https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/javascript?filter=me",
  "kataId": "54521e9ec8e60bc4de000d6c",
  "language": "javascript",
  "success": true,
  "data": [
    "function maxSequence(arr) { /* solution code */ }"
  ],
  "error": []
}
```

If extraction fails, the result may look like this:

```json
{
  "url": "https://www.codewars.com/kata/54521e9ec8e60bc4de000d6c/solutions/javascript?filter=me",
  "kataId": "54521e9ec8e60bc4de000d6c",
  "language": "javascript",
  "success": false,
  "data": [],
  "error": [
    {
      "code": "SOLUTION_NOT_FOUND",
      "message": "Solution not found"
    }
  ]
}
```

If the input is invalid or the language is not included in the supported language list, `url` may be an empty string. Valid fields, such as `kataId` and `language`, are retained when available.

Each result contains the following properties:

- `url` — the generated Codewars solution URL, or an empty string if a URL could not be generated.
- `kataId` — the kata identifier, or an empty string if it is invalid or unavailable.
- `language` — the supplied language identifier, or an empty string if it is unavailable.
- `success` — indicates whether solution extraction succeeded.
- `data` — an array containing the extracted solution code on success; otherwise, an empty array.
- `error` — an array of error objects. Each error contains a `code` and a `message`. The array is empty when no errors occurred.

The examples illustrate the result structure. Actual error codes and messages depend on the error encountered.

## Authentication

The library uses the Codewars `remember_user_token` cookie to authenticate and access your solutions.

You can find this cookie in your browser's developer tools under **Application → Cookies → `https://www.codewars.com`**.

The token must be valid and may need to be refreshed if it expires or becomes invalid.

**Security:** Treat your authentication token like a password. Never commit a valid token to a Git repository or expose it in source code, configuration files, logs, or documentation. If you use an environment variable or a `.env` file, ensure that secrets are excluded from version control. If a token is accidentally exposed, invalidate or refresh it as soon as possible.

## Error Handling

The library returns structured results so that applications can handle individual extraction failures.

Errors may occur because of authentication problems, inaccessible or locked solutions, missing solution code, browser navigation failures, invalid input, or other unexpected conditions.

Check the `success` property to determine whether extraction succeeded. If it is `false`, inspect the `error` array for error codes and messages.

Invalid input items can produce error results without preventing other valid items from being processed.

Some failures, such as browser launch errors or other errors outside individual solution processing, may reject the `getSolutions()` promise. Use `try...catch` when calling the function if you need to handle these failures.

## Limitations

- Only solutions accessible to the authenticated Codewars account can be extracted.
- Some solutions may be locked or unavailable.
- The supported language list depends on the installed version of `@codewarstools/codewars-languages`.
- Changes to the Codewars website may affect the extraction process.
- Puppeteer requires additional system resources to launch and control a browser.

## License

See the [LICENSE](LICENSE) file for license information.