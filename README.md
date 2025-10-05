# TalkHuman MCP 🚀

> Make AI write like a human - eliminate AI slop based on academic research

A Model Context Protocol (MCP) server that helps AI assistants write naturally by detecting and preventing "AI slop" - the telltale patterns that make AI-generated text obvious.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Kalypsokichu-code/talkhuman-mcp)

## What is AI Slop?

AI slop refers to low-quality AI-generated text with telltale patterns:

- **Information Utility Issues**: Low density, irrelevant content, factual errors
- **Style Quality Problems**: Repetitive structures, AI clichés like "delve into", "leverage"
- **Structure Issues**: Excessive verbosity, poor coherence

Based on research from [arXiv:2509.19163v1](https://arxiv.org/abs/2509.19163) analyzing expert annotations from NLP writers and philosophers.

## Quick Setup (2 minutes)

### For Claude Desktop

1. **Open Settings** → Developer → Edit Config (or manually edit `claude_desktop_config.json`)

2. **Add TalkHuman MCP:**

```json
{
  "mcpServers": {
    "talkhuman": {
      "url": "https://talkhuman-mcp.vercel.app/api/mcp"
    }
  }
}
```

3. **Restart Claude Desktop** - You'll see 🔌 TalkHuman tools available!

### For Other MCP Clients

Use the MCP endpoint: `https://talkhuman-mcp.vercel.app/api/mcp`

Works with:
- Cursor IDE
- Any MCP-compatible tool
- Custom MCP clients

## Available Tools

### 1. `get_human_writing_rules`

Get comprehensive anti-slop rules for any writing context.

**Example:**
```
Get writing rules for a technical blog post
```

Returns research-based guidelines to make AI text sound human.

### 2. `check_for_slop`

Analyze text for AI slop indicators. Detects cliché phrases, repetitive patterns, and telltale signs.

**Example:**
```
Check this for slop: "In today's digital landscape, it's important to note
that we should leverage cutting-edge solutions to delve into the robust
ecosystem..."
```

**Returns:**
```
⚠️ AI Cliché Phrases Found: landscape, it's important to note, leverage,
cutting-edge, delve into, robust, ecosystem
```

### 3. `get_slop_examples`

Get examples of AI slop patterns to avoid, categorized by type.

**Example:**
```
Show me phrase examples to avoid
```

Categories: `phrases`, `structure`, `tone`, `all`

## What Gets Detected?

### AI Cliché Phrases (Never Use These)

- "delve into" → use "explore"
- "leverage" → use "use"
- "it's important to note" → just state it
- "in today's digital age" → be specific
- "robust", "seamless", "holistic", "paradigm shift"
- "cutting-edge", "game changer", "unlock the potential"

### Structural Issues

- Repetitive sentence starts
- Excessive bullet points and lists
- Overly formal language ("furthermore", "moreover")
- Long, winding sentences (>25 words average)

### Research-Based Detection

Analyzes text across three dimensions from academic research:

- **Information Utility**: Density, relevance, quality (β=0.06 correlation)
- **Style Quality**: Repetition, coherence, tone, fluency (β=0.05)
- **Structure**: Verbosity, bias patterns

## Usage Examples

### In Claude Desktop

```
// Check your writing
"Use the check_for_slop tool on my draft email"

// Get context-specific rules
"Get human writing rules for casual social media posts"

// See what to avoid
"Show me examples of AI slop to avoid in my writing"
```

### As a Writing Assistant

```
// Before finalizing content
"Check this article draft for AI slop patterns"

// When drafting
"Get writing rules for professional emails, then draft a response"

// Learning what to avoid
"Show me all slop examples so I can avoid them"
```

## Deploy Your Own

```bash
# Clone the repository
git clone https://github.com/Kalypsokichu-code/talkhuman-mcp
cd talkhuman-mcp

# Install dependencies
npm install

# Deploy to Vercel
vercel deploy
```

Your MCP will be available at: `https://your-project.vercel.app/api/mcp`

## How It Works

The MCP server implements the **SSE (Server-Sent Events)** transport protocol:

1. Client connects to `/api/mcp` endpoint
2. Server streams MCP events over SSE
3. Tools are invoked via JSON-RPC 2.0 messages
4. Results are returned based on research-backed anti-slop rules

## Architecture

```
├── api/
│   ├── mcp.ts          # MCP SSE server endpoint
│   ├── index.ts        # API info endpoint
│   ├── rules.ts        # Get anti-slop rules
│   ├── check.ts        # Check text for slop
│   └── examples.ts     # Get slop examples
├── src/
│   └── rules.ts        # Anti-slop rules taxonomy
├── public/
│   └── index.html      # Documentation site
└── vercel.json         # Vercel deployment config
```

## Research Foundation

Based on expert annotations from NLP writers, philosophers, and industry professionals who identified patterns that make AI text detectable:

- **Relevance** (β=0.06) - Most important indicator
- **Density** (β=0.05) - Substantive content
- **Tone** (β=0.05) - Natural voice
- Coherence, Fluency, Structure also significant

Correlation with human perception of "slop": AUROC 0.52-0.55

## Contributing

PRs welcome! This is an open-source project to help everyone write better with AI.

## License

MIT

---

<p align="center">
  <strong>Live Demo:</strong> <a href="https://talkhuman-mcp.vercel.app">talkhuman-mcp.vercel.app</a><br>
  <strong>MCP Endpoint:</strong> <code>https://talkhuman-mcp.vercel.app/api/mcp</code>
</p>
