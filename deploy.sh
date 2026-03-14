#!/bin/bash

# 确保脚本遇到错误即停止
set -e

echo "🚀 开始执行生产环境部署..."

# 1. 检查并停止旧容器
echo "🛑 停止并清理旧的容器..."
docker-compose -f docker-compose.prod.yml down --remove-orphans

# 2. 构建并启动
echo "🏗️ 正在构建镜像并启动服务 (后台运行)..."
docker-compose -f docker-compose.prod.yml up --build -d

echo "✅ 部署完成！"
echo "🌐 访问地址: http://服务器公网IP"
echo "📊 后端接口: http://服务器公网IP:8080"
echo "🛠️ 调试日志: docker-compose -f docker-compose.prod.yml logs -f"
