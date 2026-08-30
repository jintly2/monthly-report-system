@echo off
chcp 65001 >nul
echo ========================================
echo   运营中心工作月报系统 - 一键启动脚本
echo ========================================
echo.

echo [1/4] 检查 Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到 Node.js，请先安装 Node.js 18+
    echo 下载地址：https://nodejs.org/zh-cn
    pause
    exit /b 1
)
echo Node.js 已安装
echo.

echo [2/4] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖，首次启动可能需要几分钟...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
) else (
    echo 依赖已安装
)
echo.

echo [3/4] 检查环境配置...
if not exist ".env" (
    echo 正在创建环境配置文件...
    copy .env.example .env >nul
    echo 请编辑 .env 文件，配置数据库连接信息
    echo 默认配置：postgresql://postgres:postgres@localhost:5432/monthly_report
)
echo.

echo [4/4] 启动服务...
echo.
echo ========================================
echo   后端地址：http://localhost:3000
echo   前端地址：http://localhost:5173
echo   按 Ctrl+C 停止服务
echo ========================================
echo.

start "后端服务" cmd /k "npm run dev:server"
timeout /t 3 /nobreak >nul
start "前端服务" cmd /k "npm run dev:client"

echo 服务已启动，浏览器将自动打开...
timeout /t 5 /nobreak >nul
start http://localhost:5173

pause
