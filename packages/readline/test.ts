#!/usr/bin/env bun

/**
 * Test script for @p3g/readline package
 */

import { question, questionHidden, createInterface } from './index.js';

async function runTests() {
  console.log('🧪 Testing @p3g/readline package...\n');

  try {
    // Test 1: Simple question
    console.log('Test 1: Simple question');
    const name = await question('What is your name? ');
    console.log(`Hello, ${name}!\n`);

    // Test 2: Hidden input
    console.log('Test 2: Hidden input (password)');
    const password = await questionHidden('Enter password: ');
    console.log('Password received!\n');

    // Test 3: Interface with custom prompt
    console.log('Test 3: Interface with custom prompt');
    const rl = createInterface({ prompt: '❯ ' });
    
    const color = await new Promise<string>((resolve) => {
      rl.question('What is your favorite color? ', (answer) => {
        resolve(answer);
        rl.close();
      });
      rl.prompt();
    });
    
    console.log(`Your favorite color is ${color}\n`);

    // Test 4: Multiple questions
    console.log('Test 4: Multiple questions');
    const age = await question('How old are you? ');
    const city = await question('Where are you from? ');
    console.log(`You are ${age} years old and from ${city}\n`);

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Only run tests if this file is executed directly
if (import.meta.url === `file://${(globalThis as any).process?.argv[1]}`) {
  runTests();
}

export { runTests };