/**
 * readline - Native readline implementation for interactive CLI prompts
 * Zero-dependency alternative to Node.js readline module
 */

export interface ReadlineOptions {
  input?: any;
  output?: any;
  prompt?: string;
}

export interface QuestionOptions {
  hideEchoBack?: boolean;
  mask?: string;
}

export class Interface {
  private input: NodeJS.ReadStream;
  private output: NodeJS.WriteStream;
  private promptText: string;
  private buffer: string = '';
  private isReading: boolean = false;

  constructor(options: ReadlineOptions) {
    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;
    this.promptText = options.prompt || '> ';
    
    // Set input to raw mode for character-by-character reading
    if (this.input.isTTY) {
      this.input.setRawMode(true);
    }
    
    this.input.setEncoding('utf8');
    this.setupListeners();
  }

  private setupListeners(): void {
    this.input.on('data', (chunk: string) => {
      this.handleInput(chunk);
    });

    this.input.on('close', () => {
      this.close();
    });
  }

  private handleInput(chunk: string): void {
    for (const char of chunk) {
      switch (char) {
        case '\r': // Enter
        case '\n':
          this.submitLine();
          break;
        case '\u0003': // Ctrl+C
          this.emit('SIGINT');
          this.close();
          process.exit(0);
          break;
        case '\u007f': // Backspace
          this.backspace();
          break;
        case '\u001b': // Escape sequences (arrow keys, etc.)
          // Skip escape sequences for simplicity
          break;
        default:
          if (char >= ' ' && char <= '~') {
            this.buffer += char;
            this.output.write(char);
          }
          break;
      }
    }
  }

  private submitLine(): void {
    this.output.write('\n');
    const line = this.buffer;
    this.buffer = '';
    this.emit('line', line);
  }

  private backspace(): void {
    if (this.buffer.length > 0) {
      this.buffer = this.buffer.slice(0, -1);
      this.output.write('\b \b'); // Move back, space, move back
    }
  }

  setPrompt(prompt: string): void {
    this.promptText = prompt;
  }

  prompt(preserveCursor?: boolean): void {
    this.output.write(this.promptText);
    this.isReading = true;
  }

  question(query: string, callback: (answer: string) => void): void {
    this.once('line', callback);
    this.output.write(query);
    this.isReading = true;
  }

  questionAsync(query: string, options?: QuestionOptions): Promise<string> {
    return new Promise((resolve) => {
      if (options?.hideEchoBack) {
        this.questionHidden(query, resolve, options.mask);
      } else {
        this.question(query, resolve);
      }
    });
  }

  private questionHidden(query: string, callback: (answer: string) => void, mask = '*'): void {
    const originalWrite = this.output.write;
    
    // Override write to mask characters
    this.output.write = (chunk: string | Buffer): boolean => {
      if (typeof chunk === 'string' && chunk.length === 1 && chunk >= ' ' && chunk <= '~') {
        return originalWrite.call(this.output, mask);
      }
      return originalWrite.call(this.output, chunk);
    };

    this.once('line', (answer: string) => {
      // Restore original write function
      this.output.write = originalWrite;
      this.output.write('\n');
      callback(answer);
    });

    this.output.write(query);
    this.isReading = true;
  }

  pause(): this {
    this.input.pause();
    return this;
  }

  resume(): this {
    this.input.resume();
    return this;
  }

  close(): void {
    if (this.input.isTTY) {
      this.input.setRawMode(false);
    }
    this.removeAllListeners();
    this.input.destroy();
  }

  write(data: string | Buffer, key?: { name: string }): void {
    this.output.write(data);
  }

  // EventEmitter-like methods
  private listeners: Map<string, Array<(...args: any[]) => void>> = new Map();

  on(event: string, listener: (...args: any[]) => void): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
    return this;
  }

  once(event: string, listener: (...args: any[]) => void): this {
    const wrapped = (...args: any[]) => {
      listener(...args);
      this.removeListener(event, wrapped);
    };
    return this.on(event, wrapped);
  }

  removeListener(event: string, listener: (...args: any[]) => void): this {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  removeAllListeners(): this {
    this.listeners.clear();
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
      return true;
    }
    return false;
  }
}

// Factory function to create readline interface
export function createInterface(options: ReadlineOptions): Interface {
  return new Interface(options);
}

// Convenience function for simple question
export function question(query: string, options?: ReadlineOptions): Promise<string> {
  const rl = new Interface({
    input: options?.input || (globalThis as any).process?.stdin,
    output: options?.output || (globalThis as any).process?.stdout,
    prompt: options?.prompt
  });
  
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Hidden input function
export function questionHidden(query: string, mask?: string, options?: ReadlineOptions): Promise<string> {
  const rl = new Interface({
    input: options?.input || (globalThis as any).process?.stdin,
    output: options?.output || (globalThis as any).process?.stdout,
    prompt: options?.prompt
  });
  
  return new Promise((resolve) => {
    rl.questionAsync(query, { hideEchoBack: true, mask }).then((answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export default {
  createInterface,
  question,
  questionHidden,
  Interface
};