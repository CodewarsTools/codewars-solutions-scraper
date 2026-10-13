# Codewars Solutions Scraper

A Node.js library for extracting your own solution code from [Codewars](https://www.codewars.com/) using Puppeteer.

## Features

- Extract solution code from Codewars.
- Process multiple kata solutions in a single request.
- Support multiple programming languages.
- Authenticate using a Codewars session cookie.
- Handle errors with consistent error codes.
- Return structured results as an array of objects.

## Requirements

- Node.js 20+
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

const results = await getSolutions(urls, {
  rememberUserToken: process.env.CODEWARS_TOKEN,
  browser: {
    headless: false,
  },
});
```

The example uses an environment variable to provide the token. However, the package does not require this specific approach. Users are responsible for obtaining the token and supplying it securely using a method of their choice.

The `browser.headless` option controls whether the browser runs in headless mode:

- `true` — runs without a visible browser window.
- `false` — displays the browser window.

## Data Format

### Input

The library accepts an array of objects. Each object specifies the kata ID and programming language.

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

The library returns an array of result objects, with one result for each requested kata and language.

```json
[
  {
    "kataId": "54521e9ec8e60bc4de000d6c",
    "language": "javascript",
    "success": true,
    "data": "function maxSequence(arr) { /* solution code */ }",
    "error": null
  },
  {
    "kataId": "5a0d38c9697598b67a000041",
    "language": "python",
    "success": false,
    "data": null,
    "error": {
      "code": "SOLUTION_NOT_FOUND",
      "message": "Solution code could not be found."
    }
  }
]
```

Each result contains the following properties:

- `kataId` — the Codewars kata identifier.
- `language` — the programming language identifier.
- `success` — indicates whether extraction succeeded.
- `data` — the extracted solution source code, or `null` if extraction failed.
- `error` — error information, or `null` if extraction succeeded.

The examples illustrate the expected data structure. Actual error codes and messages depend on the error encountered.

## Authentication

The library uses the Codewars `remember_user_token` cookie to authenticate and access your solutions.

You can find this cookie in your browser's developer tools under **Application → Cookies → `https://www.codewars.com`**.

The token must be valid and may need to be refreshed if it expires or becomes invalid.

**Security:** Treat your authentication token as a password. Never commit a valid token to a Git repository or expose it in source code, configuration files, logs, or documentation. If you use an environment variable or a `.env` file, ensure that secrets are excluded from version control. If a token is accidentally exposed, invalidate or refresh it as soon as possible.

## Error Handling

The library returns structured results that allow applications to handle extraction failures independently.

Errors may occur because of authentication problems, inaccessible or locked solutions, missing solution code, browser navigation failures, or other unexpected conditions.

Check the `success` property to determine whether extraction succeeded, and inspect `error` when it failed.

## Limitations

- Only solutions accessible to the authenticated Codewars account can be extracted.
- Some solutions may be locked or unavailable.
- Changes to the Codewars website may affect the extraction process.
- Puppeteer requires additional system resources to launch and control a browser.

## License

See the [LICENSE](LICENSE) file for license information.