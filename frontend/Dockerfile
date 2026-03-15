# 第一阶段：构建
FROM node:20-alpine AS builder

# 安装 pnpm 并设置淘宝镜像
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && pnpm config set registry https://registry.npmmirror.com

WORKDIR /app

# 拷贝全部文件进行构建
COPY . .

# 执行构建 (增加生产环境变量)
RUN pnpm install --no-frozen-lockfile
RUN sed -i 's|http://localhost:5174/|/rms-app-service/|g' base-app/src/App.tsx
RUN NODE_ENV=production pnpm build

# 第二阶段：运行
FROM nginx:stable-alpine

# 创建目录
RUN mkdir -p /usr/share/nginx/html/base-app /usr/share/nginx/html/rms-app

# 拷贝构建产物
COPY --from=builder /app/base-app/dist /usr/share/nginx/html/base-app
COPY --from=builder /app/rms-app/dist /usr/share/nginx/html/rms-app

# 拷贝 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 81

CMD ["nginx", "-g", "daemon off;"]
