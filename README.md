# сodewars-solutions-scraper

[![npm version](https://img.shields.io/npm/v/@codewarstools/codewars-solutions-scraper)](https://www.npmjs.com/package/@codewarstools/codewars-solutions-scraper)

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
- A valid `remember_user_token` cookie to access your solutions.

## Installation

Install the package from [npm](https://www.npmjs.com/package/@codewarstools/codewars-solutions-scraper):

```bash
npm install @codewarstools/codewars-solutions-scraper
```

The package requires Node.js 20 or later.


## Usage

Import `getSolutions` and provide an array of kata objects, an authentication token, and optional browser settings.

```js
import { getSolutions } from '@codewarstools/codewars-solutions-scraper';

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
  // Read the authentication token from an environment variable.
  rememberUserToken: process.env.CODEWARS_TOKEN,
  browser: {
    headless: false,
  },
});

console.dir(results, { depth: null });
```

The library generates solution URLs from the supplied kata IDs and language identifiers.

The example reads the authentication token from the `CODEWARS_TOKEN` environment variable. See [Authentication](#authentication) for other ways to provide the token securely.

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

The package does not automatically obtain, store, refresh, or manage authentication tokens. The application using the package is responsible for obtaining a valid token and providing it through the `rememberUserToken` option.

You can choose the approach that best fits your application.

### Option 1: Environment variable

Read the token from an environment variable:

```js
const results = await getSolutions(katas, {
  rememberUserToken: process.env.CODEWARS_TOKEN,
});
```

For local development, you can define the variable in a `.env` file:

```dotenv
CODEWARS_TOKEN=your_remember_user_token
```

With Node.js 20.6 or later, load it using:

```bash
node --env-file=.env app.js
```

Add `.env` to `.gitignore` to prevent accidentally committing the token.

### Option 2: GitHub Actions secrets

For automated workflows, store the token in a GitHub repository secret.

1. Open your repository settings.
2. Navigate to **Secrets and variables → Actions**.
3. Create a repository secret named `CODEWARS_TOKEN`.

Pass it to your application through an environment variable:

```yaml
steps:
  - name: Fetch Codewars solutions
    env:
      CODEWARS_TOKEN: ${{ secrets.CODEWARS_TOKEN }}
    run: node app.js
```

Your application can then access it through `process.env.CODEWARS_TOKEN`.

Do not print secrets in workflow logs or expose them to untrusted code.

### Option 3: Operating system environment variables

You can set the variable directly in your terminal.

PowerShell:

```powershell
$env:CODEWARS_TOKEN = "your_remember_user_token"
node app.js
```

Linux or macOS:

```bash
export CODEWARS_TOKEN="your_remember_user_token"
node app.js
```

### Option 4: Secret managers

For production applications, you can retrieve the token from a secret-management service or your deployment platform's secret store. Pass the retrieved value to `getSolutions()` through `rememberUserToken`.

### Obtaining the token

You can find the `remember_user_token` cookie in your browser's developer tools under **Application → Cookies → `https://www.codewars.com`**.

Copy the cookie's value and pass it to `getSolutions()` through the `rememberUserToken` option. The token must be valid and may need to be replaced if it expires or becomes invalid.

Treat this value as a secret because it can provide access to your Codewars account. Never share it or commit it to a repository.

### Security

Treat your authentication token like a password.

- Never commit a real token to a Git repository.
- Do not hardcode tokens in source code or documentation.
- Do not print tokens in application or CI logs.
- Exclude local `.env` files from version control.
- Restrict access to secrets in automated workflows.
- If a token is accidentally exposed, invalidate or refresh it as soon as possible.

The package does not require a specific token-management approach. Choose the method that best fits your application and deployment environment.

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