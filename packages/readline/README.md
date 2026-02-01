# @p3g/readline

Native readline implementation for interactive CLI prompts - zero-dependency alternative to Node.js readline module.

## Features

- ✅ Zero external dependencies
- ✅ Interactive question prompts
- ✅ Hidden input (password masking)
- ✅ EventEmitter-like interface
- ✅ Cross-platform compatible
- ✅ TypeScript support

## Installation

```bash
# If using as part of p3g
bun add @p3g/readline

# Or use directly from the monorepo
```

## Usage

### Simple Question Prompt

```typescript
import { question } from '@p3g/readline';

const name = await question('What is your name? ');
console.log(`Hello, ${name}!`);
```

### Hidden Input (Password)

```typescript
import { questionHidden } from '@p3g/readline';

const password = await questionHidden('Enter password: ');
console.log('Password received!');
```

### Advanced Interface

```typescript
import { createInterface } from '@p3g/readline';

const rl = createInterface({
  prompt: '❯ '
});

rl.question('What is your favorite color? ', (answer) => {
  console.log(`Your favorite color is ${answer}`);
  rl.close();
});

rl.prompt();
```

### With Custom Options

```typescript
import { question } from '@p3g/readline';

const email = await question('Email: ', {
  input: process.stdin,
  output: process.stdout
});
```

## API

### `question(query: string, options?: ReadlineOptions): Promise<string>`

Ask a question and return a promise with the user's answer.

### `questionHidden(query: string, mask?: string, options?: ReadlineOptions): Promise<string>`

Ask a question with hidden input (useful for passwords). Optional mask character.

### `createInterface(options: ReadlineOptions): Interface`

Create a readline interface instance.

### Interface Methods

- `question(query: string, callback: (answer: string) => void)` - Ask question with callback
- `questionAsync(query: string, options?: QuestionOptions)` - Async question with options
- `setPrompt(prompt: string)` - Set the prompt text
- `prompt(preserveCursor?: boolean)` - Display prompt
- `pause()` - Pause input
- `resume()` - Resume input
- `close()` - Close interface
- `write(data: string | Buffer)` - Write data to output

## Options

```typescript
interface ReadlineOptions {
  input?: ReadStream;    // Input stream (default: process.stdin)
  output?: WriteStream;  // Output stream (default: process.stdout)
  prompt?: string;       // Prompt text (default: '> ')
}

interface QuestionOptions {
  hideEchoBack?: boolean; // Hide typed characters
  mask?: string;          // Character to mask with (default: '*')
}
```

## Why This Package?

Unlike Node.js built-in `readline`, this package:
- Has zero external dependencies
- Works with Bun natively
- Provides a cleaner async/await API
- Includes built-in hidden input support
- Is designed specifically for CLI applications

## License

MIT © Suissa