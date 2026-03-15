# 第一阶段：构建
FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && pnpm config set registry https://registry.npmmirror.com

WORKDIR /app
COPY . .

# 安装依赖
RUN pnpm install --no-frozen-lockfile

# 关键：动态替换微前端地址，并确保替换的是整个 url 属性
RUN sed -i 's|url="http://localhost:5174/"|url="/rms-app-service/"|g' base-app/src/App.tsx

# 执行构建 (明确指定 --mode production)
RUN pnpm -r run build --mode production

# 第二阶段：运行
FROM nginx:stable-alpine
COPY --from=builder /app/base-app/dist /usr/share/nginx/html/base-app
COPY --from=builder /app/rms-app/dist /usr/share/nginx/html/rms-app
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 81
CMD ["nginx", "-g", "daemon off;"]
