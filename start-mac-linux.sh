#!/bin/bash
echo "========================================"
echo "  运营中心工作月报系统 - 一键启动脚本"
echo "========================================"
echo ""

echo "[1/4] 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "错误：未检测到 Node.js，请先安装 Node.js 18+"
    echo "Mac: brew install node"
    echo "Linux: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi
echo "Node.js 已安装: $(node -v)"
echo ""

echo "[2/4] 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖，首次启动可能需要几分钟..."
    npm install
    if [ $? -ne 0 ]; then
        echo "依赖安装失败，请检查网络连接"
        exit 1
    fi
else
    echo "依赖已安装"
fi
echo ""

echo "[3/4] 检查环境配置..."
if [ ! -f ".env" ]; then
    echo "正在创建环境配置文件..."
    cp .env.example .env
    echo "请编辑 .env 文件，配置数据库连接信息"
fi
echo ""

echo "[4/4] 启动服务..."
echo ""
echo "========================================"
echo "  后端地址：http://localhost:3000"
echo "  前端地址：http://localhost:5173"
echo "  按 Ctrl+C 停止服务"
echo "========================================"
echo ""

# 启动后端
npm run dev:server &
SERVER_PID=$!

# 等待后端启动
sleep 3

# 启动前端
npm run dev:client &
CLIENT_PID=$!

# 等待前端启动
sleep 5

# 打开浏览器
if command -v open &> /dev/null; then
    open http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
fi

echo "服务已启动！"
echo "后端 PID: $SERVER_PID"
echo "前端 PID: $CLIENT_PID"
echo ""

# 等待用户中断
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT TERM
wait
