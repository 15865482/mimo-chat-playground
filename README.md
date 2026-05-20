# MiMo Chat Playground

<p align="center">
  <img src="https://img.shields.io/badge/MiMo-V2.5--Pro-blue?style=for-the-badge&logo=xiaomi&logoColor=white" alt="MiMo">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>基于 Xiaomi MiMo-V2.5 系列大模型的全功能 AI 聊天 Playground</strong>
</p>

<p align="center">
  <a href="#-项目简介">中文</a> •
  <a href="#english">English</a> •
  <a href="#-功能特性">功能特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-部署">部署</a>
</p>

---

## 🇨🇳 项目简介

**MiMo Chat Playground** 是一个面向 Xiaomi MiMo-V2.5 大模型系列的全功能 Web 聊天应用。它提供了与 Claude Code、Cursor 等主流 AI 编程工具一致的交互体验，同时充分利用了 MiMo 模型的独特能力——**百万上下文窗口**、**原生多模态支持**（文本、图像、视频、音频理解）以及 **万亿参数 MoE 架构**的 MiMo-V2.5-Pro。

本项目专为 **Xiaomi MiMo Orbit 百万亿 Token 创造者激励计划** 开发，旨在展示 MiMo 模型在真实应用场景中的集成能力和实际价值。

### 为什么选择这个项目

- **真实需求**：AI 聊天界面是开发者日常使用频率最高的工具形态之一
- **深度集成**：完整实现了 MiMo API 的流式调用、多模态输入、Token 管理
- **生产级质量**：TypeScript 全栈、响应式设计、暗色模式、持久化存储
- **可扩展**：模块化架构，可快速扩展为 Coding Agent、客服机器人等垂直应用

## English

**MiMo Chat Playground** is a full-featured web chat application built for the Xiaomi MiMo-V2.5 model series. It delivers an interactive experience comparable to mainstream AI tools like Claude Code and Cursor, while leveraging MiMo's unique capabilities — **1M context window**, **native multi-modal support** (text, image, video, audio), and the **trillion-parameter MoE architecture** of MiMo-V2.5-Pro.

This project was developed for the **Xiaomi MiMo Orbit 100 Trillion Token Creator Incentive Program**, demonstrating real-world integration and practical value of MiMo models.

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🔄 **流式对话** | 基于 SSE 的实时流式响应，逐字输出，体验流畅 |
| 🖼️ **多模态输入** | 支持图片上传，利用 MiMo-V2.5 的原生多模态能力 |
| 💬 **多会话管理** | 创建、重命名、删除多个独立对话，数据本地持久化 |
| 🎛️ **System Prompt** | 可视化编辑器，自定义 AI 角色和行为方式 |
| 🤖 **模型切换** | MiMo-V2.5-Pro 与 MiMo-V2.5 之间一键切换 |
| 📊 **Token 统计** | 实时追踪 Token 使用量，帮助控制成本 |
| 🌙 **暗色模式** | 支持亮色/暗色主题，自动记忆偏好 |
| 📝 **Markdown 渲染** | 代码高亮、表格、引用等完整 Markdown 支持 |
| 📱 **响应式设计** | 适配桌面端和移动端 |
| 🔒 **安全架构** | API Key 通过服务端代理，不暴露给客户端 |

## 🏗️ 技术架构

```
┌─────────────────────────────────────────┐
│              Browser (Client)            │
│  ┌───────────┐  ┌────────────────────┐  │
│  │  Next.js   │  │  Zustand Store     │  │
│  │  App Router│  │  (State + Persist) │  │
│  └───────────┘  └────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │ HTTP (SSE Stream)
┌──────────────────▼──────────────────────┐
│          Next.js API Route               │
│     /api/chat → Proxy → MiMo API        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│        Xiaomi MiMo API                   │
│   api.xiaomimimo.com/v1/chat/completions │
│   • MiMo-V2.5-Pro (万亿 MoE)            │
│   • MiMo-V2.5 (多模态)                  │
└─────────────────────────────────────────┘
```

### 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript 5
- **样式**：TailwindCSS 3
- **状态管理**：Zustand + localStorage 持久化
- **Markdown**：react-markdown + react-syntax-highlighter
- **图标**：Lucide React
- **部署**：Vercel / Docker

## 🚀 快速开始

### 前置条件

- Node.js 18+
- Xiaomi MiMo 平台 API Key（在 [platform.xiaomimimo.com](https://platform.xiaomimimo.com) 获取）

### 安装

```bash
# 克隆仓库
git clone https://github.com/15865482/mimo-chat-playground.git
cd mimo-chat-playground

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 MIMO_API_KEY

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 环境变量

```bash
# MiMo API 密钥（必填）
MIMO_API_KEY=your-api-key-here

# MiMo API 地址（可选，默认值如下）
MIMO_BASE_URL=https://api.xiaomimimo.com/v1
```

## 📦 部署

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/15865482/mimo-chat-playground)

一键部署到 Vercel，记得在环境变量中设置 `MIMO_API_KEY`。

### Docker 部署

```bash
# 构建镜像
docker build -t mimo-chat-playground .

# 运行容器
docker run -p 3000:3000 -e MIMO_API_KEY=your-key mimo-chat-playground
```

## 📁 项目结构

```
src/
├── app/
│   ├── api/chat/route.ts    # MiMo API 服务端代理
│   ├── globals.css           # 全局样式 + Tailwind
│   ├── layout.tsx            # 根布局（主题初始化）
│   └── page.tsx              # 主页面
├── components/
│   ├── ChatInput.tsx         # 输入框（文本 + 图片上传）
│   ├── ChatInterface.tsx     # 聊天主界面
│   ├── MessageBubble.tsx     # 消息气泡（Markdown 渲染）
│   ├── ModelSelector.tsx     # 模型选择器
│   ├── Sidebar.tsx           # 对话列表侧边栏
│   ├── SystemPromptEditor.tsx # System Prompt 编辑器
│   ├── ThemeToggle.tsx       # 主题切换
│   ├── TokenCounter.tsx      # Token 用量统计
│   └── WelcomeScreen.tsx     # 欢迎页面
├── lib/
│   ├── mimo-api.ts           # MiMo API 客户端（流式）
│   ├── store.ts              # Zustand 全局状态
│   └── utils.ts              # 工具函数
└── types/
    └── index.ts              # TypeScript 类型定义
```

## 🔌 MiMo API 集成说明

本项目通过两种方式集成 MiMo API：

1. **服务端代理**（推荐）：`/api/chat` 路由代理请求到 MiMo API，保护 API Key 安全
2. **客户端直连**：开发环境下支持直接从浏览器调用 MiMo API

支持的模型：
- `MiMo-V2.5-Pro`：万亿参数 MoE，深度适配 Agent 与 Coding 场景
- `MiMo-V2.5`：原生多模态，支持文本、图像、视频、音频理解

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。本项目使用 MIT 协议开源。

## 📄 License

MIT License © 2026 MiMo Chat Playground Contributors

---

<p align="center">
  <sub>Built with ❤️ for the Xiaomi MiMo community</sub>
</p>
