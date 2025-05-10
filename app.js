#!/usr/bin/env node

import { readFileSync } from 'fs';
import { calculateCommissions } from './src/services/commission-service.js';
import { formatOutput } from './src/utils/output-formatter.js';

const run = async () => {
  try {
    // Get the input file path from command line arguments
    const [, , filePath] = process.argv;

    // Check if file path is provided
    if (!filePath) {
      throw new Error('Please provide a path to the input file');
    }

    // Read and parse the input file
    const data = JSON.parse(readFileSync(filePath, 'utf8'));

    // Calculate commissions for all operations
    const commissions = await calculateCommissions(data);

    // Format and output the results
    const formattedOutput = formatOutput(commissions);
    console.log(formattedOutput);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

run();
