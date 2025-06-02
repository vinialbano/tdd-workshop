# ==========================================
# Base stage
# ==========================================
FROM node:22-alpine AS base

# Install essential tools and set up pnpm environment
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ==========================================
# Pruner stage
# ==========================================
FROM base AS pruner
WORKDIR /app

# Install Turborepo for efficient monorepo management
RUN pnpm add -g turbo@2

# Copy the full source code to analyze dependencies
COPY . .

# Use Turborepo to prune the monorepo
RUN turbo prune api --docker

# ==========================================
# Builder stage
# ==========================================
FROM base AS builder
WORKDIR /app

# Copy the pruned package.json files
COPY --from=pruner /app/out/json/ .

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install

# Copy the pruned source code and build the application
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build

# Deploy the API package to a clean directory with only production dependencies
RUN pnpm --filter api --prod deploy build

# ==========================================
# Runner stage
# ==========================================
FROM base AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 express

# Copy all necessary files from the builder stage
COPY --from=builder --chown=express:nodejs /app/build/node_modules ./node_modules
COPY --from=builder --chown=express:nodejs /app/build/dist/ ./

# Switch to the non-root user for security
USER express

# Configure the production environment
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Start the Express application
CMD ["node", "server.js"] 