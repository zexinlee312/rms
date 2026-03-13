#!/bin/bash

# 检查 Java 版本
echo "正在检查 Java 环境..."
if command -v java >/dev/null 2>&1; then
    java_version=$(java -version 2>&1 | head -n 1)
    echo "发现 Java: $java_version"
else
    echo "错误: 未找到 Java 环境，请先安装 JDK 17。"
    exit 1
fi

# 检查 Maven
echo "正在检查 Maven..."
if command -v mvn >/dev/null 2>&1; then
    mvn_version=$(mvn -version | head -n 1)
    echo "发现 Maven: $mvn_version"
else
    echo "警告: 未找到 Maven，建议使用 'brew install maven' 安装。"
fi

# 检查 Docker
echo "正在检查 Docker..."
if command -v docker >/dev/null 2>&1; then
    if docker info >/dev/null 2>&1; then
        echo "Docker 运行中。"
    else
        echo "警告: Docker 已安装但未启动。"
    fi
else
    echo "警告: 未找到 Docker，建议使用 Docker Desktop 启动 PostgreSQL。"
fi

# 检查后端依赖
echo "正在预载后端 Maven 依赖..."
cd backend && mvn dependency:go-offline -B
cd ..

# 检查前端依赖
echo "正在检查前端依赖..."
if [ ! -d "frontend/node_modules" ]; then
    echo "前端依赖未安装，正在安装..."
    cd frontend && npm install
    cd ..
else
    echo "前端依赖已就绪。"
fi

echo "------------------------------------------------"
echo "环境检查完毕！"
echo "1. 启动数据库: docker-compose up -d"
echo "2. 启动后端: cd backend && mvn spring-boot:run"
echo "3. 启动前端: cd frontend && npm run dev"
echo "------------------------------------------------"
