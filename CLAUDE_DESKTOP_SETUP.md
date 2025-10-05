# Claude Desktop Setup

## Installation

### Option 1: NPX (Recommended for Claude Desktop)
Add this to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "talkhuman": {
      "command": "npx",
      "args": [
        "-y",
        "talkhuman-mcp"
      ]
    }
  }
}
```

### Option 2: Local Development
If you're developing locally, use the absolute path:

```json
{
  "mcpServers": {
    "talkhuman": {
      "command": "node",
      "args": [
        "/Users/kalypso/Documents/GitHub/talkhuman-mcp/dist/index.js"
      ]
    }
  }
}
```

## Available Tools

Once configured, Claude Desktop will have access to these tools:

### 1. `get_human_writing_rules`
Get comprehensive anti-slop writing rules.

**Parameters:**
- `context` (optional): The writing context (e.g., "technical documentation", "blog post")

### 2. `check_for_slop`
Analyze text for AI slop indicators.

**Parameters:**
- `text` (required): The text to analyze

### 3. `get_slop_examples`
Get categorized examples of AI slop to avoid.

**Parameters:**
- `category` (optional): "phrases", "structure", "tone", or "all"

## Verification

After updating your config:
1. Restart Claude Desktop completely
2. Open a new conversation
3. Type a message and you should see the TalkHuman tools available in the tool picker (🔧 icon)

## Troubleshooting

If tools don't appear:
- Check that the config file path is correct
- Verify JSON syntax is valid (no trailing commas)
- Look at Claude Desktop logs: `~/Library/Logs/Claude/`
- Make sure you fully quit and restarted Claude Desktop
