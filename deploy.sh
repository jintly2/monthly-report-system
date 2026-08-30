#!/bin/bash
# ============================================
# 运营中心工作月报系统 - 阿里云ECS一键部署脚本
# 适用系统：Ubuntu 20.04 / 22.04
# ============================================

set -e

echo "========================================"
echo "  运营中心工作月报系统 - 开始部署"
echo "========================================"
echo ""

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用 root 用户运行此脚本"
    exit 1
fi

# [1/8] 更新系统
echo "[1/8] 更新系统软件包..."
apt update -y
apt upgrade -y

# [2/8] 安装 Node.js 20
echo "[2/8] 安装 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# [3/8] 安装 PostgreSQL
echo "[3/8] 安装 PostgreSQL..."
apt install -y postgresql postgresql-contrib

# 启动 PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# [4/8] 创建数据库和用户
echo "[4/8] 创建数据库..."
sudo -u postgres psql <<EOF
CREATE DATABASE monthly_report;
CREATE USER report_user WITH PASSWORD 'Report@2025';
GRANT ALL PRIVILEGES ON DATABASE monthly_report TO report_user;
EOF

# 修改PostgreSQL认证方式，允许本地密码连接
sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf
systemctl restart postgresql

# [5/8] 下载代码
echo "[5/8] 下载项目代码..."
cd /opt
if [ -d "monthly-report" ]; then
    rm -rf monthly-report
fi
git clone https://github.com/jintly2/monthly-report-system.git monthly-report
cd monthly-report

# [6/8] 安装依赖并构建
echo "[6/8] 安装依赖并构建项目（这一步可能需要几分钟）..."
npm config set registry https://registry.npmmirror.com
npm install
npm run build

# [7/8] 配置环境变量
echo "[7/8] 配置环境变量..."
cat > .env <<EOF
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://report_user:Report@2025@localhost:5432/monthly_report
EOF

# 初始化数据库表
echo "初始化数据库表结构..."
PGPASSWORD='Report@2025' psql -U report_user -d monthly_report -f migrations/001_init.sql

# [8/8] 安装PM2并启动服务
echo "[8/8] 配置服务并启动..."
npm install -g pm2

# 创建PM2启动配置
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'monthly-report',
    script: 'dist/server/main.js',
    cwd: '/opt/monthly-report',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      SERVER_HOST: '0.0.0.0',
      SERVER_PORT: '3000',
      DATABASE_URL: 'postgresql://report_user:Report@2025@localhost:5432/monthly_report'
    }
  }]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root

# 安装Nginx做反向代理
echo "配置 Nginx 反向代理..."
apt install -y nginx

cat > /etc/nginx/sites-available/monthly-report <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/monthly-report /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo ""
echo "========================================"
echo "  部署完成！"
echo "========================================"
echo ""
echo "访问地址：http://$(curl -s ifconfig.me || echo '你的服务器IP')"
echo ""
echo "常用命令："
echo "  查看服务状态：pm2 status"
echo "  查看日志：pm2 logs monthly-report"
echo "  重启服务：pm2 restart monthly-report"
echo ""
echo "数据库信息："
echo "  数据库名：monthly_report"
echo "  用户名：report_user"
echo "  密码：Report@2025"
echo ""
echo "如有问题，请查看日志：pm2 logs monthly-report"
