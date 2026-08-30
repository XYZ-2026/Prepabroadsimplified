# ============================================================
# Abroad Simplified — Production Dockerfile
# Multi-stage build for Next.js 16 + Puppeteer (Chromium)
# ============================================================

# ── Stage 1: Install dependencies ──────────────────────────
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --ignore-scripts


# ── Stage 2: Build the application ─────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# ------------------------------------------------------------
# Firebase Client SDK
# These MUST be available during `next build` because
# NEXT_PUBLIC_* variables are embedded into the browser bundle.
# ------------------------------------------------------------

ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

# ------------------------------------------------------------
# Next.js build configuration
# ------------------------------------------------------------

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the Next.js application
RUN npm run build


# ── Stage 3: Production runner ─────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ------------------------------------------------------------
# Install Chromium + fonts for Puppeteer PDF generation
# ------------------------------------------------------------

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      font-noto \
      font-noto-cjk \
    && rm -rf /var/cache/apk/*

# Tell Puppeteer to use the system-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


# ------------------------------------------------------------
# Create non-root user for security
# ------------------------------------------------------------

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs


# ------------------------------------------------------------
# Copy Next.js production files
# ------------------------------------------------------------

COPY --from=builder /app/public ./public

RUN mkdir .next \
    && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/static ./.next/static


# ------------------------------------------------------------
# Runtime configuration
# ------------------------------------------------------------

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"


# ------------------------------------------------------------
# Health check
# ------------------------------------------------------------

HEALTHCHECK \
    --interval=30s \
    --timeout=10s \
    --start-period=40s \
    --retries=3 \
    CMD wget \
        --no-verbose \
        --tries=1 \
        --spider \
        http://127.0.0.1:3000/ \
        || exit 1


# ------------------------------------------------------------
# Start Next.js
# ------------------------------------------------------------

CMD ["node", "server.js"]
