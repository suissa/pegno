# Project Structure

## Root Directory Layout

```
p3g/
├── p3g.ts          # Main CLI application (single file)
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript configuration
├── README.md            # Documentation
├── .gitignore          # Git ignore rules
├── bun.lock            # Bun lockfile
├── dist/               # Build output directory
└── node_modules/       # Dependencies
```

## Key Files

### `p3g.ts`

- Single-file CLI application (~300 lines)
- Contains all functionality: installation, linking, presets, sync
- Organized in logical sections with clear function separation
- Uses functional programming patterns

### `package.json`

- Defines CLI binary as `./dist/p3g.js`
- Minimal dependencies (only `kleur` for runtime)
- Bun-specific scripts and engine requirements

### `tsconfig.json`

- Configured for Bun bundler resolution
- Strict TypeScript settings
- Targets ES2022 with ESNext modules

## Global Workspace Structure

The tool creates external directories:

```
~/.p3g_workspace/
├── js/                 # Global package cache
│   ├── axios__latest/
│   └── fastify__5.0.0/
└── presets/           # Saved mini-workspaces
    ├── api.json
    └── web.json
```

## Code Organization Principles

- Single responsibility functions
- Clear separation of concerns (logging, file ops, package handling)
- Global constants at top of file
- Utility functions before main logic
- Main execution in async IIFE at bottom
