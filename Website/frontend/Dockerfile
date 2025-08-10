# syntax=docker/dockerfile:1

FROM node:18-alpine as build
WORKDIR /app

# Copy files and install deps
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve build using serve
FROM node:18-alpine as prod
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist

# Use environment PORT or fallback to 3000
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l $PORT"]