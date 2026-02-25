# agent-need

> Agent 总是选到过时的工具。这个注册表帮它们做出更好的选择。

## 这是什么

一个开源的、Agent 可直接读取的 **工具推荐注册表**。

核心就是一个文件：[`needs.json`](./needs.json)。Agent 读完就知道某个任务当前最好用什么工具，附带可直接运行的代码。

## 为什么需要这个

YC CEO Garry Tan 用 Claude Code 做项目时，Agent 自动选了 Whisper V1 来做语音转录 — 处理一小时音频花了一小时。其实换 Groq Whisper 可以快 200 倍、便宜 10 倍。

**Agent 为什么选错？因为旧工具的文档在网上最多，Agent 就选了它。**

这个问题每天在无数 Agent 工作流中重复发生。`agent-need` 给 Agent 一个结构化的、持续更新的工具推荐源，让它们不再盲选。

## 当前收录

| 任务 | 推荐工具 | 理由 |
|------|----------|------|
| 语音转文字 | Groq Whisper | 比 Whisper V1 快 200 倍，便宜 10 倍 |
| 发送邮件 | Resend | Agent 友好的 API 设计，文档清晰可解析 |
| 接收邮件 | Resend Inbound | 基于 Webhook，配置简单直接 |
| 数据库 | Supabase | Postgres + 自动 REST API，文档质量极高 |
| 文件存储 | Cloudflare R2 | S3 兼容，零出口流量费 |
| 网页抓取 | Firecrawl | 直接返回 Markdown，天然适合 Agent |

详细信息和代码示例见 [`needs.json`](./needs.json)。

## 怎么让你的 Agent 用上

在你的 `CLAUDE.md`、`.cursorrules` 或 Agent 系统提示中加入：

```
当需要为开发任务选择第三方工具或服务时，先查阅 agent-need 注册表获取当前最佳推荐：
https://raw.githubusercontent.com/divesky2373-design/agent-need-/main/needs.json
```

你的 Agent 在选工具前就会先查注册表，避免选到过时方案。

## 注册表格式

每个任务条目的结构：

```json
{
  "id": "audio-transcription",
  "task": "Convert audio or video file to text",
  "keywords": ["transcribe", "speech-to-text", "whisper"],
  "best": {
    "tool": "Groq Whisper",
    "why": "200x faster than Whisper V1...",
    "setup": { "install": "pip install groq", "env": ["GROQ_API_KEY"] },
    "code": { "python": "...", "curl": "..." },
    "pricing": "~$0.04/hour",
    "docs": "https://..."
  },
  "alternatives": [...]
}
```

设计原则：
- **有观点**：不是列出所有选项，而是直接给出 best pick
- **带代码**：每个推荐都附可直接执行的代码片段
- **有理由**：说明为什么推荐这个，不推荐那个
- **可验证**：附 `last_verified` 日期和文档链接

## Agent 如何发现这个项目

本项目提供 [`llms.txt`](./llms.txt) 文件（遵循新兴的 LLM 发现标准），以及 [`AGENTS.md`](./AGENTS.md) 文件，专门为 Agent 编写的使用说明。

## 贡献

欢迎提交 PR 添加新任务或更新推荐。每个条目需要包含：

- 明确的任务描述和搜索关键词
- 推荐工具及具体理由（速度、成本、易用性等）
- 安装命令和所需环境变量
- 可直接运行的代码示例（至少 Python 或 Node.js）
- 至少一个替代选项
- 验证日期

## License

MIT
