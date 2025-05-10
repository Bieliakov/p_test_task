# Commission Fee Calculator

A Node.js application for calculating commission fees for financial operations.

## Description

This application calculates commission fees for cash-in and cash-out operations based on different rules for natural and juridical persons. It handles weekly free limits for natural persons and applies minimum and maximum commission constraints.

## Features

- Commission calculation for cash-in operations
- Commission calculation for cash-out operations for natural persons with weekly free limits
- Commission calculation for cash-out operations for juridical persons with minimum fees
- Dynamic configuration fetching from API
- Functional programming approach with ES6 modules

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

## Input Format

The input JSON file should contain an array of operations, each with the following structure:

```json
{
  "date": "2016-01-05",
  "user_id": 1,
  "user_type": "natural",
  "type": "cash_in",
  "operation": {
    "amount": 200.00,
    "currency": "EUR"
  }
}
```

## Running Tests

Run the tests with:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

- `app.js` - Entry point for the application
- `src/api/` - API interactions for fetching configurations
- `src/services/` - Business logic for commission calculations
- `src/utils/` - Utility functions for date handling, math operations, etc.
- `input.json` - Example input file

## Commission Rules

### Cash In
- Commission fee: 0.03% of the amount
- Maximum fee: 5.00 EUR

### Cash Out (Natural Persons)
- Commission fee: 0.3% of the amount
- 1000.00 EUR per week (Monday-Sunday) is free of charge
- Commission is calculated only from the exceeded amount

### Cash Out (Juridical Persons)
- Commission fee: 0.3% of the amount
- Minimum fee: 0.50 EUR per operation
