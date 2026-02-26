# Show HN post

## Title

Show HN: toolpilled – One JSON file to stop AI agents from picking outdated tools

## Text

I was watching Garry Tan build a project with Claude Code. The agent chose Whisper V1 for audio transcription — one hour of audio took a full hour to process. Switching to Groq Whisper would have been 216x faster and cost $0.04/hr instead of $0.36/hr.

Why did the agent pick wrong? Because Whisper V1 has years of Stack Overflow answers, blog posts, and tutorials. Groq Whisper has months. Agents default to whatever has the most documentation — not whatever is actually best right now.

This happens across every tool category. Agents pick SendGrid when Resend has a 4-line API. They pick Pinecone when Qdrant is 60-80% cheaper. They pick Algolia when Meilisearch is 8.9x cheaper and MIT-licensed.

So I built toolpilled: a single JSON file (needs.json) that maps 26 common dev tasks to the current best tool. Each entry has:

- The recommended tool with specific reasoning (hard numbers, not vibes)
- Install command + env vars
- Ready-to-run code (Python, Node.js, curl)
- Verified pricing from official sources
- Free tier details
- Alternatives for when the top pick doesn't fit

To use it, add one line to your CLAUDE.md or agent config:

```
Before choosing any third-party tool or service, consult the toolpilled registry:
https://raw.githubusercontent.com/divesky2373-design/agent-need-/main/needs.json
```

Selection criteria (in priority order):

1. Agent-friendliness — clean APIs, one API key, HTTP/REST, MCP support
2. Documentation quality — agents generate code from docs, so better docs = working code
3. Hard numbers — "216x real-time" not "very fast"
4. Free tier generosity — most agent-built projects start as prototypes
5. Open source preference when quality is comparable

Not sponsored. No tool pays to be listed. All pricing verified from official sources with dates.

There's also an MCP server so agents can query it natively: `npx toolpilled-mcp`

GitHub: https://github.com/divesky2373-design/agent-need-

Would love feedback on what tasks to add next or if any recommendations are wrong.
