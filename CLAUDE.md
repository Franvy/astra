# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Fumadocs 是一个用于在任何 React.js 框架中构建文档网站的框架。这是一个 monorepo 项目，使用 Turborepo、pnpm 和 Changesets 进行管理。

官方支持的框架：
- Next.js
- Vite: Tanstack Start, Waku, React Router

所有包都是 **ESM only**。

## Monorepo 结构

```
fumadocs/
├── packages/           # 核心库和可复用包
│   ├── core/          # 核心库，支持任何 React.js 框架
│   ├── ui/            # UI 组件库（Next.js 专用）
│   ├── mdx/           # MDX 源和加载器
│   ├── mdx-remote/    # 远程 MDX 支持
│   ├── openapi/       # OpenAPI 支持
│   ├── twoslash/      # TypeScript Twoslash 集成
│   ├── typescript/    # TypeScript 文档生成
│   ├── doc-gen/       # 文档生成工具
│   ├── cli/           # CLI 工具
│   └── ...            # 其他工具包
├── apps/
│   ├── docs/          # 主文档网站（fumadocs.dev）
│   └── blog/          # 博客应用
└── examples/          # 各种框架和集成的示例项目
```

## 常用命令

### 开发

```bash
# 运行所有项目（不包括 examples）
pnpm dev:all

# 只运行主文档站点
pnpm dev --filter=docs

# 运行所有 examples
pnpm dev:examples

# 运行特定包
pnpm dev --filter=<package-name>
```

**注意**：首次运行文档站点时，需要先构建依赖：
```bash
pnpm run build --filter=./packages/*
pnpm run dev --filter=docs
```

### 构建

```bash
# 构建所有项目
pnpm build

# 构建特定包
pnpm build --filter=<package-name>

# 构建所有 packages
pnpm build --filter=./packages/*
```

### 测试和检查

```bash
# 运行单元测试
pnpm test

# 更新快照（如有必要）
pnpm test -- -u

# 类型检查
pnpm types:check

# Lint 检查
pnpm lint

# 代码格式化
pnpm prettier

# 检查格式
pnpm lint:prettier
```

### 发布流程

```bash
# 添加 changeset（记录变更）
pnpm changeset

# 版本提升
pnpm version

# 发布到 npm
pnpm release
```

## 核心架构

### Source API（数据源系统）

Fumadocs 使用统一的 Source API 来管理文档内容：

- **fumadocs-core/source**: 核心抽象层，定义了 `loader()` 和插件系统
- **fumadocs-mdx**: MDX 文件的主要数据源实现
- 支持多个数据源通过 `multiple()` 组合

示例（见 `apps/docs/lib/source.tsx`）：
```typescript
export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {...}),
  }),
  {
    baseUrl: '/docs',
    plugins: [/* loader plugins */],
  }
);
```

### MDX 配置系统

MDX 配置在 `source.config.ts` 中定义：

- `defineDocs()`: 定义文档集合
- `defineCollections()`: 定义其他类型的集合（如博客）
- `defineConfig()`: 全局 MDX 配置，包括插件和 MDX 选项

支持的特性：
- JSON Schema 插件
- 最后修改时间追踪
- 代码块语法高亮（使用 Shiki）
- TypeScript Twoslash 支持
- 数学公式（KaTeX）
- 步骤组件
- 自动类型表生成

### 包之间的依赖关系

1. **fumadocs-core**: 最底层，框架无关的核心功能
   - Page tree 管理
   - TOC（目录）生成
   - 搜索索引
   - 国际化支持

2. **fumadocs-mdx**: 基于 core，提供 MDX 内容源
   - 文件系统加载器
   - MDX 编译和处理
   - 插件系统

3. **fumadocs-ui**: 基于 core，提供 UI 组件（Next.js 专用）
   - 布局组件（DocsLayout, HomeLayout, NotebookLayout）
   - MDX 组件
   - 主题系统
   - 导航组件

4. **专用包**: 基于 core/mdx
   - **fumadocs-openapi**: OpenAPI 文档生成
   - **fumadocs-typescript**: TypeScript API 文档
   - **fumadocs-twoslash**: TypeScript 代码悬停提示

### 文档站点架构（apps/docs）

构建流程：
1. **pre-build** (`scripts/pre-build.ts`): 运行注册表构建等预处理
2. **build**: Next.js 构建
3. **post-build** (`scripts/post-build.ts`): 后处理任务

关键文件：
- `source.config.ts`: MDX 集合和配置定义
- `lib/source.tsx`: 数据源初始化和插件配置
- `lib/layout.shared.tsx`: 共享布局选项
- `content/blog/`: 博客 MDX 文件（已移至根目录）

## 开发注意事项

### 提交 PR 前

1. 使用 `pnpm prettier` 格式化代码
2. 使用 `pnpm changeset` 添加变更集，记录你的修改
3. 运行 `pnpm test` 并在必要时更新快照
4. 确保 `pnpm types:check` 和 `pnpm lint` 通过

### 新功能开发

在提交新功能 PR 前，请先开一个 Feature Request issue，提供充分的信息和理由。

### 文档贡献

文档位于 `/apps/docs/content/blog/`（博客文章）。提交前请检查拼写和语法错误。

### 包管理器

- 使用 **pnpm** (版本 10.18.3)
- Node.js 版本要求: >= 18.17.0
- Turborepo 用于任务编排和缓存

### 运行时要求

某些包在构建时使用 Bun：
- 文档站点的构建脚本使用 `bun` 运行（见 `apps/docs/package.json`）
- 确保系统安装了 Bun（如需要）

### 环境变量

文档站点可能使用以下环境变量（见 `turbo.json`）：
- `NEXT_PUBLIC_ORAMA_*`: Orama 搜索集成
- `GITHUB_*`: GitHub 集成
- `INKEEP_API_KEY`: Inkeep 集成

开发时不需要任何额外的环境变量即可运行项目。