# TalkHuman MCP

A Model Context Protocol (MCP) server that helps AI write like a human by eliminating "AI slop" - the telltale patterns, phrases, and structures that make AI-generated text obvious.

Based on academic research from "Measuring AI Slop in Text" ([arXiv:2509.19163v1](https://arxiv.org/abs/2509.19163)), this MCP provides system-level rules and tools to detect and prevent AI writing patterns.

## What is AI Slop?

AI slop refers to low-quality AI-generated text with these characteristics:

- **Information Utility Issues**: Low density, irrelevant content, factual errors
- **Style Quality Problems**: Repetitive structures, unnatural tone, AI clichés
- **Structure Issues**: Excessive verbosity, poor coherence, bias

## Features

### 3 MCP Tools

1. **`get_human_writing_rules`** - Get comprehensive anti-slop rules for any writing task
2. **`check_for_slop`** - Analyze text for AI slop indicators
3. **`get_slop_examples`** - See examples of patterns to avoid

## Installation

### Option 1: Remote HTTP/SSE (Recommended for Vercel)

Use the hosted version (deploy to Vercel first):

```json
{
  "mcpServers": {
    "talkhuman": {
      "url": "https://your-deployment.vercel.app/sse"
    }
  }
}
```

### Option 2: Local stdio (Claude Desktop)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "talkhuman": {
      "command": "npx",
      "args": ["-y", "talkhuman-mcp"]
    }
  }
}
```

### Option 3: Self-Hosted

```bash
git clone https://github.com/yourusername/talkhuman-mcp
cd talkhuman-mcp
npm install
npm start
```

Server runs on `http://localhost:3000` with SSE endpoint at `/sse`

## Usage

### Get Anti-Slop Rules

```typescript
// In your AI prompt
const rules = await use_mcp_tool("get_human_writing_rules", {
  context: "technical blog post"
});
// Returns comprehensive rules to add to system prompt
```

### Check Text for Slop

```typescript
const analysis = await use_mcp_tool("check_for_slop", {
  text: "In today's digital landscape, it's important to note that we should leverage cutting-edge solutions..."
});
// Returns: "⚠️ AI Cliché Phrases Found: landscape, it's important to note, leverage, cutting-edge"
```

### Get Examples

```typescript
const examples = await use_mcp_tool("get_slop_examples", {
  category: "phrases" // or "structure", "tone", "all"
});
```

## Key Anti-Slop Rules

### Never Use These Phrases
- "delve into" → use "explore"
- "leverage" → use "use"
- "it's important to note" → just state it
- "in today's digital age" → be specific
- "robust", "seamless", "holistic", "synergy"

### Avoid These Patterns
- Starting every sentence the same way
- Overusing bullet points and lists
- Excessive formality and hedging
- Meta-commentary about what you'll say
- Generic corporate jargon

### Write Like a Human
- Vary sentence structure and length
- Be direct and specific
- Use natural, conversational tone
- Cut unnecessary words
- Show personality when appropriate

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run HTTP/SSE server (modern, for remote hosting)
npm start

# Run stdio server (legacy, for local CLI)
npm run start:stdio

# Watch mode
npm run dev
```

## Deploy to Vercel

This MCP uses modern HTTP/SSE transport for remote hosting:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Configure your MCP client with the URL
# https://your-project.vercel.app/sse
```

## Transport Methods

- **HTTP/SSE** (default): Modern approach, works remotely, perfect for Vercel
- **stdio**: Legacy approach, local only, works with `npm run start:stdio`

## How It Works

The MCP analyzes text across three dimensions identified in academic research:

1. **Information Utility** (Density, Relevance, Quality)
2. **Style Quality** (Repetition, Coherence, Tone, Fluency)
3. **Structure** (Verbosity, Bias)

These correlate with human perception of "slop" with high accuracy (AUROC 0.52-0.55).

## Research Foundation

Based on expert annotations from NLP writers, philosophers, and industry professionals who identified patterns that make AI text detectable:

- **Relevance** (β=0.06) - Most important indicator
- **Density** (β=0.05) - Substantive content
- **Tone** (β=0.05) - Natural voice
- Coherence, Fluency, Structure also significant

## Contributing

This is an open-source project. PRs welcome!

## License

MIT

