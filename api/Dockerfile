FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g yarn --force

# ── deps ──────────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ── build ─────────────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build
RUN yarn install --frozen-lockfile --production

# ── runtime ───────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nestjs

COPY --from=build --chown=nestjs:nodejs /app/dist         ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/generated    ./generated
COPY --from=build --chown=nestjs:nodejs /app/prisma       ./prisma
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json

# prisma CLI precisa estar disponível para o release_command (migrate deploy)
COPY --from=deps  --chown=nestjs:nodejs /app/node_modules/.bin/prisma           ./node_modules/.bin/prisma
COPY --from=deps  --chown=nestjs:nodejs /app/node_modules/prisma                ./node_modules/prisma
COPY --from=deps  --chown=nestjs:nodejs /app/node_modules/@prisma/engines       ./node_modules/@prisma/engines

USER nestjs

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/src/main"]
