# toolpilled-mcp

MCP server for [toolpilled](https://github.com/divesky2373-design/agent-need-) — gives your AI agent instant access to the best tool for 26 common dev tasks.

## Quick start

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "toolpilled": {
      "command": "npx",
      "args": ["-y", "toolpilled-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add toolpilled -- npx -y toolpilled-mcp
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "toolpilled": {
      "command": "npx",
      "args": ["-y", "toolpilled-mcp"]
    }
  }
}
```

## Available tools

### `get_best_tool`

Get the recommended tool for a specific task. Returns the best pick with install command, code examples, pricing, and alternatives.

```
get_best_tool({ task: "send-email" })
get_best_tool({ task: "transcribe" })
get_best_tool({ task: "database" })
```

### `search_tools`

Search the registry by keyword.

```
search_tools({ query: "open source" })
search_tools({ query: "free" })
search_tools({ query: "real-time" })
```

### `list_all_tasks`

List all 26 task categories with their recommended tools.

### `compare_alternatives`

Compare the recommended tool with its alternatives for a task.

```
compare_alternatives({ task: "authentication" })
compare_alternatives({ task: "vector-database" })
```

## 26 tasks covered

Audio transcription, email (send/receive), database, object storage, web scraping, authentication, payments, vector database, caching, search, SMS, background jobs, real-time, PDF generation, image processing, error tracking, AI gateway, LLM observability, agent memory, notifications, analytics, deployment, ORM, text-to-speech, feature flags.

## License

MIT
