# Technology Stack

## Runtime & Build System

- **Primary Runtime**: Bun (>=1.1.0)
- **Language**: TypeScript 5.6+
- **Module System**: ESNext with Bundler resolution
- **Build Target**: Bun-specific builds

## Dependencies

- **Runtime**: `kleur` for colored terminal output
- **Dev**: `bun-types`, `typescript`, `@types/node`

## Common Commands

### Development

```bash
bun run dev          # Watch mode development
bun run start        # Run directly
```

### Building

```bash
bun build p3g.ts --outdir dist --target bun
bun build p3g.ts --outdir dist --target node
```

### Maintenance

```bash
bun run clean        # Clean dependencies and cache
```

## Code Standards

- Use native Node.js APIs (`fs`, `os`, `path`, `child_process`)
- Minimal external dependencies philosophy
- TypeScript strict mode enabled
- ESNext target with modern syntax
- Executable shebang: `#!/usr/bin/env bun`

## Architecture Patterns

- Single-file CLI application
- Functional programming approach
- Global state through environment variables
- Synchronous operations for simplicity
- Error handling with process.exit(1) for failures
