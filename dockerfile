# 使用指定版本的 Bun 镜像作为基础
FROM oven/bun:slim as base
WORKDIR /usr/src/app

# 安装依赖到临时目录以优化缓存
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# 构建阶段
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

# 生产环境镜像
FROM base AS production
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.next/standalone ./
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/.next/static ./.next/static
COPY --from=build /usr/src/app/worker ./worker
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/start.sh ./start.sh

# 设置环境变量和用户
ENV NODE_ENV=production
RUN chmod +x start.sh && chown -R bun:bun /usr/src/app
USER bun
# 确保 .next 目录存在并设置权限
RUN mkdir -p /usr/src/app/.next/cache && chown -R bun:bun /usr/src/app/.next

EXPOSE 3000
CMD ["./start.sh"]