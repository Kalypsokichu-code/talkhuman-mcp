# TalkHuman MCP

> Tools to eliminate AI slop from text

Model Context Protocol server with tools to detect and eliminate AI slop from text. Based on expert annotations from NLP writers and philosophers analyzing AI-generated text patterns.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Kalypsokichu-code/talkhuman-mcp)

## What is AI Slop?

Low-quality AI text characterized by:

- **Information Utility**: Low content density, irrelevant filler, factual errors
- **Style Quality**: Repetitive structures, corporate clichés ("delve into", "leverage")
- **Structure**: Excessive verbosity, poor coherence, formulaic patterns

Research foundation: [arXiv:2509.19163v1](https://arxiv.org/abs/2509.19163)

## Quick Start

### Claude Desktop (HTTP Transport)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "talkhuman": {
      "url": "https://talkhuman-mcp.vercel.app/api/mcp"
    }
  }
}
```

### Claude Desktop (Local stdio - Recommended for Development)

```json
{
  "mcpServers": {
    "talkhuman": {
      "command": "node",
      "args": [
        "/path/to/talkhuman-mcp/dist/index.js"
      ]
    }
  }
}
```

### Cursor IDE & Other MCP Clients

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "talkhuman": {
      "url": "https://talkhuman-mcp.vercel.app/api/mcp"
    }
  }
}
```

**Restart your client after configuration!**

## Available Tools

### `get_human_writing_rules`

Get comprehensive anti-slop writing rules tailored to your context.

**Parameters:**
- `context` (optional): Writing type (e.g., "technical blog", "email", "docs")

**Example:**
```
Get writing rules for a technical blog post
```

### `check_for_slop`

Analyze text for AI slop indicators across three dimensions.

**Parameters:**
- `text` (required): The text to analyze

**Example:**
```
Check this for slop: "In today's digital landscape, it's important to
note that we should leverage cutting-edge solutions to deliver a
seamless user experience..."
```

**Returns:**
```
⚠️ AI Slop Analysis

- Overused Phrases: Found AI clichés - landscape, it's important to note,
  leverage, cutting-edge, seamless
- Verbosity: Overly long sentences (avg 28.5 words)
- Word Complexity: Unnecessarily formal - "utilize" → "use"

Recommendation: Revise to be more concise, direct, and natural.
```

### `get_slop_examples`

Get categorized examples of AI slop patterns to avoid.

**Parameters:**
- `category` (optional): `"phrases"`, `"structure"`, `"tone"`, or `"all"`

**Example:**
```
Show me phrase examples to avoid
```

## What Gets Detected

### Slop Phrases

- "delve into" → "explore"
- "leverage" → "use"
- "it's important to note" → just state it
- "robust", "seamless", "holistic", "paradigm shift"
- "cutting-edge", "game changer", "synergy"

### Structural Issues

- Repetitive sentence starts (same word 3+ times)
- Excessive bullet points and lists
- Overly formal language for casual contexts
- Long sentences (>25 words average)
- Low lexical density (<40% unique words)

### Research-Based Scoring

Text analyzed across three weighted dimensions:

- **Information Utility** (β=0.06) - Content density, relevance
- **Style Quality** (β=0.05) - Repetition, coherence, naturalness
- **Structure** (β=0.05) - Verbosity, bias, flow

## Development

### Prerequisites

- Node.js 18+
- TypeScript 5.6+
- npm or pnpm

### Local Setup

```bash
git clone https://github.com/Kalypsokichu-code/talkhuman-mcp
cd talkhuman-mcp
npm install
npm run build
```

### Available Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Watch mode for development
- `npm start` - Run stdio server locally
- `npx ultracite check` - Lint check
- `npx ultracite fix` - Auto-fix issues

### Testing Locally

#### Test stdio transport (Claude Desktop):
```bash
npm run build
npm start
# Server runs on stdio, test with MCP inspector:
npx @modelcontextprotocol/inspector node dist/index.js
```

#### Test HTTP transport (Cursor/Web):
```bash
vercel dev
# Visit http://localhost:3000
```

## Architecture

### Project Structure

```
talkhuman-mcp/
├── api/                    # Vercel serverless functions
│   ├── mcp.ts             # HTTP MCP endpoint (Streamable HTTP)
│   ├── index.ts           # API info page
│   ├── check.ts           # Slop detection API
│   ├── rules.ts           # Rules API
│   └── examples.ts        # Examples API
├── src/                    # Core MCP server
│   ├── index.ts           # stdio transport (Claude Desktop)
│   └── rules.ts           # Anti-slop taxonomy
├── public/
│   └── index.html         # Homepage/docs
└── dist/                   # Compiled output
```

### Dual Transport Support

**stdio Transport** (Local/Claude Desktop):
- Direct process communication
- Low latency, persistent connection
- Best for local development
- Entry: `dist/index.js`

**Streamable HTTP Transport** (Vercel/Web):
- POST-only mode (MCP 2024-11-05 spec)
- Fully stateless, serverless-optimized
- No SSE (Vercel 60s timeout limitation)
- Auto-scaling on demand
- Endpoint: `/api/mcp`

### Technology Stack

- **Runtime**: TypeScript 5.6+ with Node.js ESM modules
- **Validation**: Zod schemas for type safety
- **Linting**: Ultracite (Biome-powered)
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.19+
- **Deployment**: Vercel serverless functions

## Deploy Your Own

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kalypsokichu-code/talkhuman-mcp)

### Manual Deploy

```bash
npm install
vercel deploy --prod
```

Your MCP endpoint: `https://your-project.vercel.app/api/mcp`

### Environment Variables

None required! Server works out of the box.

## Usage Examples

### In Claude Desktop

```
"Check my email draft for AI slop patterns"
"Get writing rules for professional documentation"
"Show me examples of phrases to avoid in blog posts"
```

### As Writing Assistant

```
"Analyze this paragraph and suggest improvements:
[paste text]"

"Get human writing rules for casual Twitter posts,
then help me write a thread"
```

### API Integration

```bash
# Check text for slop
curl -X POST https://talkhuman-mcp.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'

# Get writing rules
curl https://talkhuman-mcp.vercel.app/api/rules?context=email
```

## Research Foundation

Based on expert annotations from:
- NLP researchers and writers
- Professional philosophers
- Industry content creators

**Key Findings:**
- **Relevance** (β=0.06) - Most significant slop indicator
- **Content Density** (β=0.05) - Substantive vs. filler content
- **Natural Tone** (β=0.05) - Conversational vs. robotic voice
- Human perception correlation: AUROC 0.52-0.55

Full paper: [arXiv:2509.19163](https://arxiv.org/abs/2509.19163)

## Documentation

- [Claude Desktop Setup](./CLAUDE_DESKTOP_SETUP.md) - Detailed configuration guide
- [API Reference](https://talkhuman-mcp.vercel.app/api) - REST API endpoints
- [MCP Spec](https://spec.modelcontextprotocol.io) - Protocol documentation

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Quick checklist:
- Run `npx ultracite fix` before committing
- Keep changes simple and focused
- Add examples for new patterns
- Update docs if needed

## License

MIT License - see [LICENSE](./LICENSE) for details

---

**Live Demo:** [talkhuman-mcp.vercel.app](https://talkhuman-mcp.vercel.app)
**MCP Endpoint:** `https://talkhuman-mcp.vercel.app/api/mcp`
**GitHub:** [Kalypsokichu-code/talkhuman-mcp](https://github.com/Kalypsokichu-code/talkhuman-mcp)
