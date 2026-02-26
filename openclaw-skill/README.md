# toolpilled — OpenClaw Skill

> Your agent is well-read but poorly informed. Get it toolpilled.

This skill teaches OpenClaw to consult the [toolpilled registry](https://github.com/divesky2373-design/toolpilled) before choosing third-party tools, APIs, or services. It covers 26 common dev tasks with verified pricing and ready-to-run code.

## Install

```bash
claw skill add toolpilled
```

## What it does

When you ask OpenClaw to add a service to your project (email, auth, payments, database, etc.), this skill makes it check the toolpilled registry first. Instead of defaulting to whatever has the most Stack Overflow answers, it picks the current best tool with specific reasoning.

## Example

```
You: "Add email sending to my app"

OpenClaw (with toolpilled): Uses Resend — 4-line API, 3K emails/mo free
OpenClaw (without toolpilled): Might pick SendGrid — free tier retired, complex API
```

## 26 tasks covered

Audio transcription, email (send/receive), database, object storage, web scraping, authentication, payments, vector database, caching, search, SMS, background jobs, real-time, PDF generation, image processing, error tracking, AI gateway, LLM observability, agent memory, notifications, analytics, deployment, ORM, text-to-speech, feature flags.

## Also available as

- **MCP Server**: `npx toolpilled-mcp` (Claude Code, Claude Desktop, Cursor)
- **JSON file**: Add one line to your CLAUDE.md or .cursorrules
- **GitHub**: https://github.com/divesky2373-design/toolpilled
