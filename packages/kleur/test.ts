#!/usr/bin/env bun

/**
 * Test script for @p3g/kleur package
 */

import kleur, { 
  red, green, blue, yellow, magenta, cyan, white, gray,
  redBright, greenBright, blueBright, yellowBright,
  bgRed, bgGreen, bgBlue, bgYellow,
  bold, italic, underline, inverse,
  enable, disable, enabled
} from './index.js';

function runTests() {
  console.log('🧪 Testing @p3g/kleur package...\n');

  // Test environment control
  console.log('Test 1: Environment control');
  console.log('Colors enabled:', enabled());
  enable();
  console.log('After enable():', enabled());
  disable();
  console.log('After disable():', enabled());
  enable(); // Re-enable for rest of tests
  console.log('');

  // Test basic colors
  console.log('Test 2: Basic colors');
  console.log(red('This is red text'));
  console.log(green('This is green text'));
  console.log(blue('This is blue text'));
  console.log(yellow('This is yellow text'));
  console.log(magenta('This is magenta text'));
  console.log(cyan('This is cyan text'));
  console.log(white('This is white text'));
  console.log(gray('This is gray text'));
  console.log('');

  // Test bright colors
  console.log('Test 3: Bright colors');
  console.log(redBright('This is bright red'));
  console.log(greenBright('This is bright green'));
  console.log(blueBright('This is bright blue'));
  console.log(yellowBright('This is bright yellow'));
  console.log('');

  // Test background colors
  console.log('Test 4: Background colors');
  console.log(bgRed('Red background'));
  console.log(bgGreen('Green background'));
  console.log(bgBlue('Blue background'));
  console.log(bgYellow('Yellow background'));
  console.log('');

  // Test text styles
  console.log('Test 5: Text styles');
  console.log(bold('Bold text'));
  console.log(italic('Italic text'));
  console.log(underline('Underlined text'));
  console.log(inverse('Inverse text'));
  console.log('');

  // Test method chaining
  console.log('Test 6: Method chaining');
  console.log(kleur.red().bold('Red bold text'));
  console.log(kleur.blue().underline('Blue underlined text'));
  console.log(kleur.green().italic('Green italic text'));
  console.log(kleur.yellow().bold().underline('Yellow bold underlined text'));
  console.log('');

  // Test complex combinations
  console.log('Test 7: Complex combinations');
  console.log(kleur.bgWhite().black().bold('Black bold on white'));
  console.log(kleur.bgBlue().white().underline('White underlined on blue'));
  console.log(kleur.bgYellowBright().black().italic('Black italic on bright yellow'));
  console.log(kleur.redBright().bgBlack().bold().underline('Bright red on black, bold underlined'));
  console.log('');

  // Test destructured imports
  console.log('Test 8: Destructured imports');
  console.log(red('Red from destructured import'));
  console.log(green().bold('Bold green from destructured import'));
  console.log(blue().bgYellow().underline('Blue on yellow, underlined'));
  console.log('');

  console.log('✅ All kleur tests completed!');
}

// Only run tests if this file is executed directly
if (import.meta.url === `file://${(globalThis as any).process?.argv[1]}`) {
  runTests();
}

export { runTests };