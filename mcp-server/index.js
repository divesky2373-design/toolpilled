#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(join(__dirname, "needs.json"), "utf-8"));
const tasks = registry.tasks;

const server = new McpServer({
  name: "toolpilled",
  version: "1.0.0",
});

// Tool 1: Get the best tool for a specific task
server.tool(
  "get_best_tool",
  "Get the recommended tool for a development task. Returns the best pick with install command, code examples, pricing, and alternatives.",
  {
    task: z.string().describe(
      'Task ID (e.g., "send-email", "database", "authentication") or a keyword (e.g., "transcribe", "payments", "cache")'
    ),
  },
  async ({ task }) => {
    const query = task.toLowerCase();

    // Try exact ID match first
    let match = tasks.find((t) => t.id === query);

    // Then try keyword search
    if (!match) {
      match = tasks.find(
        (t) =>
          t.keywords.some((k) => k.includes(query) || query.includes(k)) ||
          t.task.toLowerCase().includes(query) ||
          t.id.includes(query)
      );
    }

    if (!match) {
      return {
        content: [
          {
            type: "text",
            text: `No matching task found for "${task}". Available tasks:\n${tasks.map((t) => `- ${t.id}: ${t.task}`).join("\n")}`,
          },
        ],
      };
    }

    const best = match.best;
    const altText =
      match.alternatives?.length > 0
        ? `\n\nAlternatives:\n${match.alternatives
            .map(
              (a) =>
                `- ${a.tool}: ${a.why}${a.pricing ? ` (${a.pricing})` : ""}`
            )
            .join("\n")}`
        : "";

    const warningText = match.warning
      ? `\n\n⚠️ WARNING: ${match.warning}`
      : "";

    const codeExamples = [];
    if (best.code?.python) codeExamples.push(`Python:\n${best.code.python}`);
    if (best.code?.node) codeExamples.push(`Node.js:\n${best.code.node}`);
    if (best.code?.curl) codeExamples.push(`curl:\n${best.code.curl}`);

    const installLines = [];
    if (best.setup.install) installLines.push(best.setup.install);
    if (best.setup.install_node) installLines.push(`Node: ${best.setup.install_node}`);
    if (best.setup.install_python) installLines.push(`Python: ${best.setup.install_python}`);
    const installText = installLines.join("\n");

    return {
      content: [
        {
          type: "text",
          text: `# ${match.task}

**Best tool: ${best.tool}**
${best.why}

## Setup
Install: ${installText}
Env vars: ${best.setup.env.join(", ")}
Get API key: ${best.setup.get_api_key || "N/A"}

## Code
${codeExamples.join("\n\n")}

## Pricing
${best.pricing}
Free tier: ${best.free_tier}

Docs: ${best.docs}
Last verified: ${best.last_verified}${warningText}${altText}`,
        },
      ],
    };
  }
);

// Tool 2: Search across all tasks by keyword
server.tool(
  "search_tools",
  "Search the toolpilled registry by keyword. Returns matching tasks with their recommended tools.",
  {
    query: z
      .string()
      .describe(
        'Search query (e.g., "email", "real-time", "open source", "free")'
      ),
  },
  async ({ query }) => {
    const q = query.toLowerCase();

    const matches = tasks.filter(
      (t) =>
        t.id.includes(q) ||
        t.task.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q)) ||
        t.best.tool.toLowerCase().includes(q) ||
        t.best.why.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results for "${query}". Try broader terms or use list_all_tasks to see all 26 categories.`,
          },
        ],
      };
    }

    const results = matches
      .map(
        (t) =>
          `**${t.id}** → ${t.best.tool}\n  ${t.task}\n  ${t.best.why}\n  Install: ${t.best.setup.install || t.best.setup.install_node || t.best.setup.install_python}\n  Pricing: ${t.best.pricing}`
      )
      .join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${matches.length} matching task(s):\n\n${results}`,
        },
      ],
    };
  }
);

// Tool 3: List all available tasks
server.tool(
  "list_all_tasks",
  "List all 26 task categories in the toolpilled registry with their recommended tools.",
  {},
  async () => {
    const list = tasks
      .map(
        (t) =>
          `- **${t.id}** → ${t.best.tool} — ${t.task} (${t.best.setup.install || t.best.setup.install_node || t.best.setup.install_python})`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `# toolpilled registry (${tasks.length} tasks)\n\nLast updated: ${registry.last_updated}\n\n${list}\n\nUse get_best_tool with any task ID to get full details, code examples, and alternatives.`,
        },
      ],
    };
  }
);

// Tool 4: Compare alternatives for a task
server.tool(
  "compare_alternatives",
  "Compare the recommended tool with its alternatives for a specific task. Useful when the top pick doesn't fit your requirements.",
  {
    task: z.string().describe("Task ID (e.g., \"database\", \"authentication\")"),
  },
  async ({ task }) => {
    const query = task.toLowerCase();
    const match =
      tasks.find((t) => t.id === query) ||
      tasks.find(
        (t) =>
          t.keywords.some((k) => k.includes(query) || query.includes(k)) ||
          t.id.includes(query)
      );

    if (!match) {
      return {
        content: [
          {
            type: "text",
            text: `No matching task found for "${task}".`,
          },
        ],
      };
    }

    const best = match.best;
    const installCmd = best.setup.install || [best.setup.install_node, best.setup.install_python].filter(Boolean).join(" / ");
    const bestInfo = `## Recommended: ${best.tool}\n${best.why}\nPricing: ${best.pricing}\nFree tier: ${best.free_tier}\nInstall: ${installCmd}`;

    const alts =
      match.alternatives?.length > 0
        ? match.alternatives
            .map(
              (a, i) =>
                `## Alternative ${i + 1}: ${a.tool}\n${a.why}${a.pricing ? `\nPricing: ${a.pricing}` : ""}${a.free_tier ? `\nFree tier: ${a.free_tier}` : ""}${a.setup?.install ? `\nInstall: ${a.setup.install}` : ""}`
            )
            .join("\n\n")
        : "No alternatives listed.";

    return {
      content: [
        {
          type: "text",
          text: `# ${match.task}\n\n${bestInfo}\n\n${alts}`,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
