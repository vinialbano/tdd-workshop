FROM node:22-slim

# Update and upgrade system packages
RUN apt update && apt upgrade -y && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Set shell to bash
SHELL ["/bin/bash", "-c"]

# Install specific versions of npm and pnpm
RUN npm install -g npm@11.4.1 pnpm@10.11.1

# Configure pnpm
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Configure pnpm store and install global tools
RUN SHELL="bash" && \
    pnpm config set store-dir "${PNPM_HOME}/store" && \
    pnpm install -g turbo@2

# Set working directory
WORKDIR /home/node/tdd-workshop

# Set environment variables
ENV NODE_ENV=development

# Keep container alive
CMD ["sleep", "infinity"] 