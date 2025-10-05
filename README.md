```
ooooooooooooo           oooo  oooo
8'   888   `8           `888  `888
     888       .oooo.    888   888  oooo
     888      `P  )88b   888   888 .8P'
     888       .oP"888   888   888888.
     888      d8(  888   888   888 `88b.
    o888o     `Y888""8o o888o o888o o888o

ooooo   ooooo
`888'   `888'
 888     888  oooo  oooo  ooo. .oo.  .oo.    .oooo.   ooo. .oo.
 888ooooo888  `888  `888  `888P"Y88bP"Y88b  `P  )88b  `888P"Y88b
 888     888   888   888   888   888   888   .oP"888   888   888
 888     888   888   888   888   888   888  d8(  888   888   888
o888o   o888o  `V88V"V8P' o888o o888o o888o `Y888""8o o888o o888o
```
# TalkHuman MCP
> AI that writes like a human

Model Context Protocol server that eliminates AI slop. Based on research analyzing expert annotations from NLP writers and philosophers.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Kalypsokichu-code/talkhuman-mcp)

## What is AI Slop?

Low-quality AI text with telltale patterns:

- **Information Utility**: Low density, irrelevant content, factual errors
- **Style Quality**: Repetitive structures, clichés like "delve into", "leverage"
- **Structure**: Excessive verbosity, poor coherence

Based on research from [arXiv:2509.19163v1](https://arxiv.org/abs/2509.19163).

## Setup

### Claude Desktop

1. Edit `claude_desktop_config.json`

2. Add configuration:

```json
{
  "mcpServers": {
    "talkhuman": {
      "url": "https://talkhuman-mcp.vercel.app/api/mcp"
    }
  }
}
```

3. Restart Claude Desktop

### Other MCP Clients

Use endpoint: `https://talkhuman-mcp.vercel.app/api/mcp`

Works with Cursor IDE and any MCP-compatible tool.

## Tools

### get_human_writing_rules

Get anti-slop rules for any writing context.

**Example:**
```
Get writing rules for a technical blog post
```

### check_for_slop

Analyze text for AI slop indicators.

**Example:**
```
Check this for slop: "In today's digital landscape, it's important to note
that we should leverage cutting-edge solutions..."
```

**Returns:**
```
AI Cliché Phrases Found: landscape, it's important to note, leverage,
cutting-edge
```

### get_slop_examples

Get examples of patterns to avoid.

**Example:**
```
Show me phrase examples to avoid
```

Categories: `phrases`, `structure`, `tone`, `all`

## Detection

### Phrases

- "delve into" → use "explore"
- "leverage" → use "use"
- "it's important to note" → just state it
- "robust", "seamless", "holistic", "paradigm shift"
- "cutting-edge", "game changer"

### Structure

- Repetitive sentence starts
- Excessive bullet points
- Overly formal language
- Long sentences (>25 words)

### Research-Based

Analyzes text across three dimensions:

- **Information Utility**: Density, relevance, quality (β=0.06)
- **Style Quality**: Repetition, coherence, tone (β=0.05)
- **Structure**: Verbosity, bias

## Usage

### In Claude Desktop

```
"Use the check_for_slop tool on my draft email"
"Get human writing rules for casual social media posts"
"Show me examples of AI slop to avoid in my writing"
```

### As Writing Assistant

```
"Check this article draft for AI slop patterns"
"Get writing rules for professional emails, then draft a response"
```

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
git clone https://github.com/Kalypsokichu-code/talkhuman-mcp
cd talkhuman-mcp
npm install
npm run build
```

### Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Watch mode for development
- `npx ultracite check` - Lint code
- `npx ultracite fix` - Auto-fix linting issues

### Deploy Your Own

```bash
npm install
vercel deploy
```

Your MCP will be at: `https://your-project.vercel.app/api/mcp`

## How It Works

MCP server implements Streamable HTTP transport (MCP 2024-11-05 spec) in **POST-only mode**:

1. **POST** `/api/mcp` - Handles all JSON-RPC 2.0 requests (initialize, tools/list, tools/call)
2. Fully stateless: no session management, no long-lived connections
3. SSE disabled: Vercel serverless has 60s timeout, incompatible with persistent SSE streams
4. Optimized for serverless: immediate responses, scales automatically
5. Client compatibility: Works with all MCP clients supporting POST-only Streamable HTTP

## Architecture

```
├── api/
│   ├── mcp.ts          # MCP Streamable HTTP endpoint
│   ├── index.ts        # API info endpoint
│   ├── rules.ts        # Anti-slop rules
│   ├── check.ts        # Text analysis
│   └── examples.ts     # Pattern examples
├── src/
│   └── rules.ts        # Anti-slop taxonomy
├── public/
│   └── index.html      # Documentation
└── vercel.json         # Deployment config
```

## Technical Details

### Transport: Streamable HTTP POST-only (MCP 2024-11-05)

- **Single endpoint**: `/api/mcp` accepts POST requests only
- **SSE disabled**: Long-lived SSE connections timeout on Vercel (60s limit on Hobby tier)
- **Fully stateless**: Zero session management, perfect for serverless auto-scaling
- **Vercel optimized**: Follows MCP spec's POST-only mode for serverless deployments
- **Why no SSE**: Per Vercel docs, "SSE requires persistent connections which are inefficient for scaling MCP servers"

### Stack

- **Runtime**: TypeScript 5.6+ with Node.js ESM
- **Linting**: Ultracite (Biome-based formatter and linter)
- **Validation**: Zod for schema validation
- **Deployment**: Vercel serverless functions

## Research Foundation

Expert annotations from NLP writers, philosophers, and industry professionals:

- **Relevance** (β=0.06) - Most important indicator
- **Density** (β=0.05) - Substantive content
- **Tone** (β=0.05) - Natural voice
- Coherence, Fluency, Structure

Correlation with human perception: AUROC 0.52-0.55

## Contributing

PRs welcome.

## License

MIT

---

**Live:** [talkhuman-mcp.vercel.app](https://talkhuman-mcp.vercel.app)
**MCP Endpoint:** `https://talkhuman-mcp.vercel.app/api/mcp`
