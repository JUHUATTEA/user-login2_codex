# 部署教程

本项目使用 Next.js、Prisma 与 SQLite，适合演示和轻量部署。生产场景建议把 SQLite 换为 Postgres（仅需在 `prisma/schema.prisma` 修改 provider 与 `DATABASE_URL`）。

## 本地启动

1. 安装 Node.js 20 LTS（最低 18.17）。
2. 在项目目录执行：

```bash
npm install
copy .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

打开 `http://localhost:3000`。特权账号由 `.env` 的 `TEST_ACCOUNT_USERNAME` 和 `TEST_ACCOUNT_PASSWORD` 决定，默认是 `demo_admin / Demo@123456`。

## Vercel 公网部署（推荐）

1. 将代码推送至 GitHub。
2. 在 Vercel 导入仓库，Framework 选择 Next.js。
3. 在 Vercel 的 Environment Variables 中配置 `AUTH_SECRET`（随机 32+ 字符）、`LLM_API_KEY`、`LLM_BASE_URL`、`LLM_MODEL`、测试账号变量。
4. **重要**：Vercel 的文件系统是临时的，不能将 SQLite 当生产数据库。将 Prisma datasource 改为 PostgreSQL，并配置托管 Postgres 的 `DATABASE_URL`；在部署前/CI 中执行 `npx prisma db push && npm run db:seed`。
5. 点击 Deploy，Vercel 会提供 `https://<project>.vercel.app` 公网地址。

## Docker / 云服务器部署

在可持久化磁盘挂载 `prisma` 目录后，执行上述“本地启动”中的数据库命令，再执行：

```bash
npm run build
npm run start
```

通过 Nginx/Caddy 反向代理到 3000 端口，并配置 HTTPS。上线前务必替换 `AUTH_SECRET`、测试账号密码，并接入真实 LLM Key。
