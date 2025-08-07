# Use a standard, stable Node.js base image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies FRESH inside the Linux container.
# This will download the correct Linux-compatible binaries.
RUN npm install

# Now, copy the rest of your application source code
COPY . .

# Run the build command using the fresh Linux modules
RUN npm run build


# --- Production Stage ---
# Create a smaller, final image for running the app
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the necessary artifacts from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# The command to start the Next.js production server
CMD ["npm", "start"]