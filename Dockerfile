FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments for ALL environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_AUTH_BASE_URL
ARG NEXT_PUBLIC_AUTH_GITHUB_ID
ARG NEXT_PUBLIC_AUTH_GITHUB_API
ARG NEXT_PUBLIC_AUTH_GITHUB_SECRET
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_SECRET

# Set environment variables for build
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_AUTH_BASE_URL=$NEXT_PUBLIC_AUTH_BASE_URL
ENV NEXT_PUBLIC_AUTH_GITHUB_ID=$NEXT_PUBLIC_AUTH_GITHUB_ID
ENV NEXT_PUBLIC_AUTH_GITHUB_API=$NEXT_PUBLIC_AUTH_GITHUB_API
ENV NEXT_PUBLIC_AUTH_GITHUB_SECRET=$NEXT_PUBLIC_AUTH_GITHUB_SECRET
ENV AUTH_GOOGLE_ID=$AUTH_GOOGLE_ID
ENV AUTH_GOOGLE_SECRET=$AUTH_GOOGLE_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

ENV HUSKY=0

RUN npm run build --ignore-scripts

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Also copy the build-time environment variables to runtime
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_AUTH_BASE_URL=$NEXT_PUBLIC_AUTH_BASE_URL
ENV NEXT_PUBLIC_AUTH_GITHUB_ID=$NEXT_PUBLIC_AUTH_GITHUB_ID
ENV NEXT_PUBLIC_AUTH_GITHUB_API=$NEXT_PUBLIC_AUTH_GITHUB_API
ENV NEXT_PUBLIC_AUTH_GITHUB_SECRET=$NEXT_PUBLIC_AUTH_GITHUB_SECRET

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]