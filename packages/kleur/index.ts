/**
 * kleur - Native terminal color styling for Node.js/Bun
 * Zero-dependency alternative to chalk/kleur with same API
 */

// ANSI color codes
const COLORS = {
  // Regular colors
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  
  // Bright colors
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],
  
  // Background colors
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  
  // Bright background colors
  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49],
  
  // Styles
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  reset: [0, 0]
} as const;

type ColorKeys = keyof typeof COLORS;

// Simple function factory
function createColorFunction(openCode: number, closeCode: number) {
  return (text: string): string => {
    // Check if colors are supported
    const noColor = (globalThis as any).process?.env?.NO_COLOR;
    const forceColor = (globalThis as any).process?.env?.FORCE_COLOR;
    
    if (noColor && !forceColor) {
      return text;
    }
    
    return `\x1b[${openCode}m${text}\x1b[${closeCode}m`;
  };
}

// Create all color functions
const kleur = {
  // Regular colors
  black: createColorFunction(...COLORS.black),
  red: createColorFunction(...COLORS.red),
  green: createColorFunction(...COLORS.green),
  yellow: createColorFunction(...COLORS.yellow),
  blue: createColorFunction(...COLORS.blue),
  magenta: createColorFunction(...COLORS.magenta),
  cyan: createColorFunction(...COLORS.cyan),
  white: createColorFunction(...COLORS.white),
  gray: createColorFunction(...COLORS.gray),
  
  // Bright colors
  redBright: createColorFunction(...COLORS.redBright),
  greenBright: createColorFunction(...COLORS.greenBright),
  yellowBright: createColorFunction(...COLORS.yellowBright),
  blueBright: createColorFunction(...COLORS.blueBright),
  magentaBright: createColorFunction(...COLORS.magentaBright),
  cyanBright: createColorFunction(...COLORS.cyanBright),
  whiteBright: createColorFunction(...COLORS.whiteBright),
  
  // Background colors
  bgBlack: createColorFunction(...COLORS.bgBlack),
  bgRed: createColorFunction(...COLORS.bgRed),
  bgGreen: createColorFunction(...COLORS.bgGreen),
  bgYellow: createColorFunction(...COLORS.bgYellow),
  bgBlue: createColorFunction(...COLORS.bgBlue),
  bgMagenta: createColorFunction(...COLORS.bgMagenta),
  bgCyan: createColorFunction(...COLORS.bgCyan),
  bgWhite: createColorFunction(...COLORS.bgWhite),
  
  // Bright background colors
  bgBlackBright: createColorFunction(...COLORS.bgBlackBright),
  bgRedBright: createColorFunction(...COLORS.bgRedBright),
  bgGreenBright: createColorFunction(...COLORS.bgGreenBright),
  bgYellowBright: createColorFunction(...COLORS.bgYellowBright),
  bgBlueBright: createColorFunction(...COLORS.bgBlueBright),
  bgMagentaBright: createColorFunction(...COLORS.bgMagentaBright),
  bgCyanBright: createColorFunction(...COLORS.bgCyanBright),
  bgWhiteBright: createColorFunction(...COLORS.bgWhiteBright),
  
  // Styles
  bold: createColorFunction(...COLORS.bold),
  dim: createColorFunction(...COLORS.dim),
  italic: createColorFunction(...COLORS.italic),
  underline: createColorFunction(...COLORS.underline),
  inverse: createColorFunction(...COLORS.inverse),
  hidden: createColorFunction(...COLORS.hidden),
  strikethrough: createColorFunction(...COLORS.strikethrough),
  reset: createColorFunction(...COLORS.reset)
};

// Add chaining capability
Object.keys(COLORS).forEach(key => {
  const func = (kleur as any)[key];
  if (func) {
    // Add chainable methods to each function
    Object.keys(COLORS).forEach(chainKey => {
      const chainFunc = (kleur as any)[chainKey];
      if (chainFunc) {
        (func as any)[chainKey] = function(text: string) {
          if (text !== undefined) {
            return func(chainFunc(text));
          }
          // Return a function that chains the colors
          return function(innerText: string) {
            return func(chainFunc(innerText));
          };
        };
      }
    });
  }
});

// Utility functions
export function enabled(): boolean {
  const noColor = (globalThis as any).process?.env?.NO_COLOR;
  const forceColor = (globalThis as any).process?.env?.FORCE_COLOR;
  return forceColor || !noColor;
}

export function disable(): void {
  if ((globalThis as any).process?.env) {
    (globalThis as any).process.env.NO_COLOR = '1';
  }
}

export function enable(): void {
  if ((globalThis as any).process?.env) {
    delete (globalThis as any).process.env.NO_COLOR;
    (globalThis as any).process.env.FORCE_COLOR = '1';
  }
}

// Export everything
export const {
  black, red, green, yellow, blue, magenta, cyan, white, gray,
  redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright,
  bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite,
  bgBlackBright, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright,
  bold, dim, italic, underline, inverse, hidden, strikethrough, reset
} = kleur;

// Default export
export default kleur;