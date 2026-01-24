# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the Nuxt application
RUN bun run build

# Production stage - use debian-based image for user creation
FROM oven/bun:1-debian AS runner

WORKDIR /app

# Create non-root user for security
RUN groupadd --system --gid 1001 nuxt && \
    useradd --system --uid 1001 --gid 1001 nuxt

# Copy built application from builder
COPY --from=builder --chown=nuxt:nuxt /app/.output /app/.output

# Switch to non-root user
USER nuxt

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the application
CMD ["bun", ".output/server/index.mjs"]
