# =============================================================================
# Multi-stage build for optimized production image
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies (Base)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory with proper permissions
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Switch to non-root user
USER node

# Copy package files
COPY --chown=node:node package*.json ./

# -----------------------------------------------------------------------------
# Stage 2: Development Dependencies
# -----------------------------------------------------------------------------
FROM base AS deps

# Install all dependencies (including dev dependencies)
RUN npm ci --only=production --silent && npm cache clean --force

# -----------------------------------------------------------------------------
# Stage 3: Build
# -----------------------------------------------------------------------------
FROM base AS build

# Install all dependencies (including dev dependencies for build)
RUN npm ci --silent && npm cache clean --force

# Copy source code
COPY --chown=node:node . .

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 4: Production
# -----------------------------------------------------------------------------
FROM base AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Copy production dependencies from deps stage
COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules

# Copy built application from build stage
COPY --from=build --chown=node:node /usr/src/app/dist ./dist

# Copy package.json for metadata
COPY --chown=node:node package.json ./

# Create logs directory
RUN mkdir -p logs && chown -R node:node logs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
