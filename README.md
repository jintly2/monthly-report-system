# 运营中心工作月报系统

南京世和基因运营中心内部工作月报系统，支持个人月报填报、部门汇总看板、月报查询、管理评审、人员管理五大功能模块。

## 技术栈

- **后端**: NestJS 10 + TypeScript + Drizzle ORM
- **前端**: React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **数据库**: PostgreSQL 14+
- **构建工具**: Vite 7

## 功能模块

### 1. 部门看板
- 月报总数、草稿、已提交、已评审统计
- 业绩盘点、奖金核算、效益评估工作项统计
- 月度提交趋势
- 本月提交进度和完成率

### 2. 我的月报
- 按月份填报个人月报
- 四大分类：业绩盘点、奖金核算、效益评估、通用信息
- 支持添加/删除多条工作记录
- 支持保存草稿和提交

### 3. 月报查询
- 按月份、状态、姓名筛选
- 列表+详情联动展示
- 查看每位同事的完整月报内容

### 4. 管理评审
- 待评审月报列表
- 查看月报摘要
- 添加评审意见
- 评审记录追溯

### 5. 人员管理
- 部门人员名单维护
- 支持增删改查
- 按姓名/职位/小组搜索
- 在职/离职状态管理

## 本地部署步骤

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

### 步骤一：安装 Node.js

**Windows:**
1. 访问 https://nodejs.org/zh-cn
2. 下载 LTS 版本（推荐 20.x）
3. 双击安装，一路下一步
4. 打开命令行输入 `node -v` 验证

**Mac:**
```bash
brew install node
```

### 步骤二：安装 PostgreSQL

**Windows:**
1. 访问 https://www.postgresql.org/download/windows/
2. 下载并安装，记住设置的密码
3. 端口默认 5432

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

### 步骤三：创建数据库

打开 PostgreSQL 的 SQL Shell（psql），执行：

```sql
CREATE DATABASE monthly_report;
CREATE USER report_user WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE monthly_report TO report_user;
\q
```

### 步骤四：配置环境变量

复制 `.env.example` 为 `.env`，修改数据库连接信息：

```
DATABASE_URL=postgresql://report_user:123456@localhost:5432/monthly_report
```

### 步骤五：初始化数据库表

```bash
psql -d monthly_report -U report_user -f migrations/001_init.sql
```

### 步骤六：安装依赖

```bash
npm install
```

如果安装慢，可以先设置国内镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

### 步骤七：启动服务

**方式一：分别启动（开发模式）**

打开两个命令行窗口：

窗口1 - 启动后端：
```bash
npm run dev:server
```

窗口2 - 启动前端：
```bash
npm run dev:client
```

**方式二：生产模式启动**

```bash
# 构建
npm run build

# 启动后端（会同时托管前端静态文件）
npm start
```

### 步骤八：访问系统

浏览器打开：http://localhost:5173 （开发模式）或 http://localhost:3000 （生产模式）

## 部署到服务器

### 服务器要求
- 2核4G以上配置
- Ubuntu 20.04+ / CentOS 7+
- 开放 80 端口

### 部署步骤

1. **安装环境**
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2（进程管理）
sudo npm install -g pm2
```

2. **上传代码**
- 将项目压缩包上传到服务器
- 解压到 `/opt/monthly-report`

3. **配置数据库**
```bash
sudo -u postgres psql
# 执行创建数据库和用户的SQL
```

4. **安装依赖并构建**
```bash
cd /opt/monthly-report
npm install
npm run build
```

5. **用 PM2 启动**
```bash
pm2 start dist/server/main.js --name monthly-report
pm2 save
pm2 startup
```

6. **配置 Nginx 反向代理**
```nginx
server {
    listen 80;
    server_name 你的域名或服务器IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 项目结构

```
├── client/                  # React 前端
│   ├── index.html
│   └── src/
│       ├── api/             # API 请求封装
│       ├── components/      # 可复用组件
│       ├── pages/           # 页面组件
│       ├── lib/             # 工具函数
│       ├── app.tsx          # 路由配置
│       └── index.tsx        # 入口文件
├── server/                  # NestJS 后端
│   ├── main.ts              # 入口文件
│   ├── app.module.ts        # 根模块
│   ├── modules/             # 业务模块
│   └── database/            # 数据库相关
├── shared/                  # 前后端共享类型
├── migrations/              # 数据库迁移脚本
├── package.json
├── .env.example
└── README.md
```

## 常见问题

### Q: npm install 报错怎么办？
A: 尝试删除 `node_modules` 和 `package-lock.json`，重新执行 `npm install`。

### Q: 数据库连接失败？
A: 检查 `.env` 文件中的 `DATABASE_URL` 是否正确，PostgreSQL 服务是否启动。

### Q: 端口被占用？
A: 修改 `.env` 中的 `SERVER_PORT`，或修改 `vite.config.ts` 中的前端端口。

### Q: 如何修改部门人员？
A: 登录系统后，在「人员管理」页面可以添加、编辑、删除人员。

### Q: 后期如何对接内部数据库？
A: 修改 `.env` 中的 `DATABASE_URL` 指向内部数据库，表结构已在 `migrations/001_init.sql` 中定义。

## 联系方式

如有问题，请联系运营中心。
