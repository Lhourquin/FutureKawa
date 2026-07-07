FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN mkdir -p /pnpm/store && pnpm config set store-dir /pnpm/store

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN pnpm prisma:generate
RUN pnpm build
RUN ls -la /app
RUN ls -la /app/dist || true

CMD ["sh", "-c", "ls -la /app && ls -la /app/dist || true && node dist/src/main"]