# TDD Workshop

A hands-on workshop to learn Test-Driven Development (TDD) by building a real application incrementally.

## Project Structure

This is a monorepo containing two main applications:

- `apps/api`: A Node.js/Express API
- `apps/web`: A Vite + TypeScript + Tailwind CSS web application

## Development Environment

### Using DevContainer (Recommended)

This project includes a DevContainer configuration for a consistent development environment. To use it:

1. Install [Docker](https://www.docker.com/products/docker-desktop)
2. Install [VS Code](https://code.visualstudio.com/) with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
3. Clone the repository:

```bash
git clone https://github.com/vinialbano/tdd-workshop.git
cd tdd-workshop
```

4. Open the project in VS Code and click "Reopen in Container" when prompted

The DevContainer includes:
- Node.js 22
- pnpm
- All necessary development tools

### Manual Setup

If you prefer to set up manually:

1. Clone the repository:

```bash
git clone https://github.com/vinialbano/tdd-workshop.git
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

## Production Environment

To run the applications in production:

1. Create environment files:

```bash
cp apps/api/.env.example apps/api/.env
```

2. Update the environment variables the `.env` files

3. Build and start the containers:

```bash
docker-compose up --build
```

The applications will be available at:
- API: http://localhost:4000
- Web: http://localhost:8080

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

## Development Commands

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
- **Containerization**: Docker, DevContainer
- **Production**: Docker Compose, Nginx

## Learning Objectives

- Understanding TDD principles and workflow
- Writing effective tests
- Building features incrementally
- Working with containerized environments

## Contributing

This is a workshop repository. Feel free to use it for learning purposes or to create your own workshop based on it.
