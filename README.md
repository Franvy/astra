# Fumadocs 文档站点

这是一个基于 [Fumadocs](https://fumadocs.dev) 构建的独立文档网站项目。

## 技术栈

- **框架**: Next.js 16
- **React**: 19.2.0
- **文档**: Fumadocs 16.x
- **样式**: Tailwind CSS 4
- **包管理器**: pnpm 或 npm
- **运行时**: Node.js >= 18.17.0, Bun (用于构建脚本)

## 快速开始

### 前置要求

- Node.js 18.17.0 或更高版本
- pnpm 或 npm
- Bun (可选，用于构建脚本)

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看你的文档站点。

### 构建

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

**注意**: 构建脚本使用 Bun 运行 pre-build 和 post-build 任务。如果你没有安装 Bun，可以：

1. 安装 Bun: `curl -fsSL https://bun.sh/install | bash`
2. 或修改 `package.json` 中的 `build:pre` 和 `build:post` 脚本为使用 `node` 或 `tsx`

### 其他命令

```bash
# 类型检查
pnpm types:check

# 代码检查
pnpm lint

# 清理构建文件
pnpm clean
```

## 项目结构

```
.
├── app/                  # Next.js App Router 页面
│   ├── (home)/          # 首页和博客
│   ├── api/             # API 路由 (搜索等)
│   └── layout.tsx       # 根布局
├── components/          # React 组件
├── content/             # MDX 文档内容
├── lib/                 # 工具函数和配置
│   ├── source.tsx      # Fumadocs 数据源配置
│   └── layout.shared.tsx # 共享布局配置
├── public/              # 静态资源
├── scripts/             # 构建脚本
├── source.config.ts     # MDX 集合配置
├── next.config.ts       # Next.js 配置
└── package.json         # 项目依赖

```

## 内容管理

### 添加新文档

1. 在 `content/` 目录下创建 `.mdx` 文件
2. 添加 frontmatter:

```mdx
---
title: 页面标题
description: 页面描述
---

# 你的内容

在这里编写文档内容...
```

### 配置导航

编辑 `lib/layout.shared.tsx` 来自定义导航和侧边栏。

## Fumadocs 版本

本项目使用以下 Fumadocs 包版本：

- `fumadocs-core`: ^16.1.0
- `fumadocs-ui`: ^16.1.0
- `fumadocs-mdx`: ^14.0.3
- `fumadocs-openapi`: ^10.0.11
- `fumadocs-typescript`: ^4.0.13
- `fumadocs-twoslash`: ^3.1.10

## 配置

### 搜索

项目使用 Orama 作为搜索引擎。配置文件：
- `lib/orama/client.ts`: 客户端搜索配置
- `scripts/update-orama-index.ts`: 更新搜索索引

### 主题

项目支持亮色/暗色主题切换。主题配置在 `app/layout.tsx` 中。

### MDX 配置

MDX 配置在 `source.config.ts` 中定义，包括：
- 代码高亮 (Shiki)
- TypeScript Twoslash
- 数学公式 (KaTeX)
- 步骤组件
- 自动类型表

## 环境变量

项目可以使用以下环境变量（可选）：

```bash
# Orama 搜索集成
NEXT_PUBLIC_ORAMA_*

# GitHub 集成
GITHUB_*

# 其他集成
INKEEP_API_KEY
```

开发时不需要任何环境变量即可运行。

## 部署

### Vercel (推荐)

1. 将项目推送到 Git 仓库
2. 在 Vercel 中导入项目
3. Vercel 会自动检测 Next.js 并进行配置
4. 部署！

### 其他平台

确保你的部署平台支持：
- Node.js 18.17.0+
- 构建命令: `npm run build` 或 `pnpm build`
- 启动命令: `npm start` 或 `pnpm start`
- 输出目录: `.next`

## 资源

- [Fumadocs 文档](https://fumadocs.dev)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 许可证

私有项目