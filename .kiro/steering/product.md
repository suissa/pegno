# Product Overview

**Pegno** is a global dependency manager for Bun that creates intelligent caching and workspace management.

## Core Purpose

- Eliminates redundant package installations across projects
- Creates a global workspace (`~/.pegno_workspace/js`) where dependencies are installed once and reused via symlinks
- Provides "mini-workspaces" (presets) to save and reapply dependency sets across projects

## Key Features

- **Global Cache**: Each package installed once, reused everywhere
- **Smart Linking**: Automatic symlinks to global cache (or copy mode with `--copy`)
- **Mini-Workspaces**: Save dependency sets as named presets for instant reuse
- **Dev Dependencies**: Support for `--dev` flag to add to devDependencies
- **Sync Mode**: Copy entire global workspace to local node_modules

## Target Audience

Bun developers frustrated with redundant package installations and seeking faster, more efficient dependency management.

## Philosophy

"Zero redundancy, intelligent linking, brutal simplicity" - everything in TypeScript with no hidden magic.
