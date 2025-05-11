# Commission Fee Calculator

A Node.js application for calculating commission fees for financial operations.

## Requirements

- Node.js version 18.0.0 or higher (required for built-in fetch API support)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Usage

Run the application with an input JSON file:

```bash
node app.js input.json
```

The application will output the calculated commission fees to stdout.

## Running Tests

Run the tests with:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Environment Variables

The application uses environment variables for configuration. These can be set in a `.env` file in the root directory.

Available environment variables:
- `API_BASE_URL` - Base URL for the commission configuration API
