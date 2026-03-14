#!/bin/bash

# 确保脚本遇到错误即停止
set -e

echo "🚀 开始执行生产环境部署..."

# 1. 探测 Compose 命令 (兼容 docker-compose 和 docker compose)
if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif docker-compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ 错误: 未找到 docker compose 或 docker-compose 命令。"
    echo "💡 请安装 Docker Compose 插件: sudo apt-get install docker-compose-plugin (针对 Ubuntu/Debian)"
    exit 1
fi

echo "✅ 使用命令: $COMPOSE_CMD"

# 2. 检查并停止旧容器
echo "🛑 停止并清理旧的容器..."
$COMPOSE_CMD -f docker-compose.prod.yml down --remove-orphans

# 3. 构建并启动
echo "🏗️ 正在构建镜像并启动服务 (后台运行)..."
$COMPOSE_CMD -f docker-compose.prod.yml up --build -d

echo "✅ 部署完成！"
echo "🌐 访问地址: http://服务器公网IP"
echo "📊 后端接口: http://服务器公网IP:8080"
echo "🛠️ 调试日志: $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
