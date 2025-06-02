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
RUN turbo prune web --docker

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

# ==========================================
# Runner stage
# ==========================================
FROM nginx:alpine AS runner

# Copy the built assets from the builder stage
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 