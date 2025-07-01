# -----------------------------------
# 1. Install dependencies only
# -----------------------------------
    FROM node:18-alpine AS deps

    # Avoid root user for security
    RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -G nextjs
    
    WORKDIR /app
    
    COPY package.json package-lock.json* ./
    
    RUN npm ci --frozen-lockfile
    
    # -----------------------------------
    # 2. Build the Next.js app
    # -----------------------------------
    FROM node:18-alpine AS builder
    
    WORKDIR /app
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    RUN npm run build
    
    # Remove all dev dependencies
    RUN npm prune --production
    
    # -----------------------------------
    # 3. Create the final image
    # -----------------------------------
    FROM node:18-alpine AS runner
    
    WORKDIR /app
    
    # Use non-root user
    RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -G nextjs
    USER nextjs
    
    ENV NODE_ENV=production
    
    # Optionally, set Next.js config for static generation
    ENV NEXT_TELEMETRY_DISABLED 1
    ENV PORT 3000
    
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    
    EXPOSE 3000
    
    CMD ["node", "node_modules/next/dist/bin/next", "start"]
    