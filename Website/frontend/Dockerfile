# Use a more standard Node.js base image. Alpine is great for size.
FROM node:20-alpine AS base

WORKDIR /app

# --- Dependencies ---
# Copy package files and install dependencies. This layer is cached effectively.
COPY package.json package-lock.json ./
RUN npm install

# --- Build ---
# Copy the rest of the source code
COPY . .
# Build the Next.js application
RUN npm run build

# --- Production ---
# This creates a minimal final image with only what's needed to run.
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production dependencies from the 'base' stage
COPY --from=base /app/node_modules ./node_modules
# Copy built application from the 'base' stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# You don't seem to need this entrypoint for a standard Next.js app.
# If you do, you can copy it here:
# COPY --from=base /app/docker-entrypoint.js ./docker-entrypoint.js
# ENTRYPOINT [ "/app/docker-entrypoint.js" ]

EXPOSE 3000

CMD ["npm", "start"]