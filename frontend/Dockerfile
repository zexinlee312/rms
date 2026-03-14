# 第一阶段：构建
FROM node:20-slim AS builder

# 安装 pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 拷贝依赖定义文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY base-app/package.json ./base-app/
COPY rms-app/package.json ./rms-app/
COPY packages/layout/package.json ./packages/layout/
COPY packages/api/package.json ./packages/api/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 拷贝源代码
COPY . .

# 动态替换微前端子应用地址（假设服务器通过 81 端口访问子应用）
# 我们将 localhost:5174 替换为相对路径或具体占位，这里建议改为占位符
RUN sed -i 's|http://localhost:5174/|/rms-app-service/|g' base-app/src/App.tsx

# 执行构建
RUN pnpm build

# 第二阶段：运行
FROM nginx:stable-alpine

# 拷贝构建产物
COPY --from=builder /app/base-app/dist /usr/share/nginx/html/base-app
COPY --from=builder /app/rms-app/dist /usr/share/nginx/html/rms-app

# 拷贝 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 81

CMD ["nginx", "-g", "daemon off;"]
