# 用户登录授权 Demo

## ① 实现方案 + 3天项目时间规划

方案：以 Next.js App Router 提供前后端一体应用，Prisma + SQLite 保存用户；注册 API 在落库前强制调用解耦的用户名审核服务；JWT HttpOnly Cookie 登录态；独立 RBAC 授权函数保护资源 API。未配置 LLM Key 时使用本地演示规则，以保证可直接启动；配置后自动调用 OpenAI 兼容接口。

| 天数 | 工作内容 |
| --- | --- |
| 第 1 天 | 页面原型、数据模型、注册/登录和会话实现 |
| 第 2 天 | LLM 审核适配、RBAC、资源 A/B 与异常处理 |
| 第 3 天 | 联调、测试、部署配置、文档与演示验收 |

## ② 整体架构、技术栈、设计出发点

浏览器页面 → Next.js Route Handlers → 审核服务 / 授权策略 / Prisma → SQLite（生产建议 Postgres）。技术栈为 TypeScript、Next.js 14、React、Prisma、SQLite、bcryptjs、jose。设计重点是低部署摩擦和可替换性：`lib/username-moderation.ts` 集中管理 Prompt 和 LLM 调用；`lib/authorization.ts` 集中管理资源权限；业务资源 API 不混入权限细节。

权限矩阵：普通注册账号访问 A 为允许、B 为拒绝；内置 `PRIVILEGED` 测试账号访问 A、B 均允许。测试账号通过 `npm run db:seed` 创建。

## ③ 开发使用的AI编码工具、预估token消耗，说明哪一部分消耗token最多

使用 Codex 进行项目脚手架、TypeScript 编码、代码审查和文档生成。预估开发消耗 71920 tokens，其中最高的是“端到端功能联调与异常路径修正”：它需要反复阅读 API、会话、数据库和 UI 之间的数据流。运行时的用户名审核 token 则由用户名长度及 Prompt 决定，当前 Prompt 很短，单次消耗较低。

## ④ 人工开发耗时最高的环节（不计算大模型运行时间）

权限与身份链路的联调通常耗时最高：需要验证密码散列、Cookie 安全属性、JWT 过期、未登录、越权和特权账号升级等边界条件，并在不同部署平台确认数据库持久化策略。

## ⑤ 本登录授权场景下，优先级最高的模块分析

最高优先级是服务端鉴权与授权模块，而不是前端按钮隐藏。资源 API 每次请求都通过 `requireResource` 校验登录态和角色，确保用户即使直接调用 API 也无法读取资源 B。其次是注册审核必须发生在数据库创建之前。生产还应优先配置 HTTPS、强随机 `AUTH_SECRET`、速率限制、审计日志与真实持久化数据库。

## 快速开始

参见 [DEPLOYMENT.md](./DEPLOYMENT.md)。本地依次执行 `npm install`、复制 `.env.example` 为 `.env`、`npm run db:push`、`npm run db:seed`、`npm run dev`。
