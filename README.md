# TDD Workshop

A hands-on workshop to learn Test-Driven Development (TDD) by building a real application incrementally.

## Project Structure

This is a monorepo containing two main applications:

- `apps/api`: A Node.js/Express API
- `apps/web`: A Vite + TypeScript + Tailwind CSS web application

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd tdd-workshop
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development servers:

```bash
pnpm dev
```

## Workshop Structure

The workshop is designed to be followed incrementally, with each feature release tagged with a semantic version. This allows you to:

1. Start from the beginning and follow along
2. Jump to any specific feature by checking out its tag
3. Compare changes between versions

### Available Versions

Each version represents a new feature or milestone in the application. To see what changed in a version:

```bash
git checkout v<version>
```

## Development

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm test`: Run tests
- `pnpm lint`: Run linting
- `pnpm format`: Format code

## Tech Stack

- **API**: Node.js, Express, TypeScript
- **Web**: Vite, TypeScript, Tailwind CSS
- **Testing**: Vitest
- **Package Manager**: pnpm
- **Monorepo**: Turborepo

## Learning Objectives

- Understanding TDD principles and workflow
- Writing effective tests
- Building features incrementally

## Contributing

This is a workshop repository. Feel free to use it for learning purposes or to create your own workshop based on it.
