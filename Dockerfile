# Dockerfile

# --- Stage 1: The Builder ---
# This stage installs dependencies and builds your Next.js application.
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If you use yarn, uncomment the line below and comment out the one above
# COPY package.json yarn.lock ./

# Install all dependencies
RUN npm install
# If you use yarn, uncomment the line below
# RUN yarn install

# Copy the rest of your application code into the container
COPY . .

# Build the application for production
# This creates an optimized .next folder
RUN npm run build
# If you use yarn, uncomment the line below
# RUN yarn build


# --- Stage 2: The Production Image ---
# This stage creates the final, lightweight image that will be run.
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Copy only the necessary files from the 'builder' stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app will run on
EXPOSE 3000

# The command to start the Next.js production server
CMD ["npm", "start"]
# If you use yarn, uncomment the line below
# CMD ["yarn", "start"]
