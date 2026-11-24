FROM node:24-slim AS build
WORKDIR /app
# Build tools in case better-sqlite3 has no prebuilt binary for this platform
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
# Fail the build early if the SQLite driver did not install
RUN node -e "new (require('better-sqlite3'))(':memory:')"
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000 DATA_DIR=/data
# Litestream streams the SQLite database to the backup bucket (see litestream.yml); it needs system CA certificates for HTTPS
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.tar.gz /tmp/litestream.tar.gz
RUN tar -xzf /tmp/litestream.tar.gz -C /usr/local/bin litestream && rm /tmp/litestream.tar.gz
COPY litestream.yml /etc/litestream.yml
COPY --from=build /app ./
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh
EXPOSE 3000
CMD ["./start.sh"]
