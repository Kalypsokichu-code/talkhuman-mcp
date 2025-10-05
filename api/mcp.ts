import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ANTI_SLOP_RULES } from "../src/rules.js";

const TOOLS: Tool[] = [
  {
    name: "get_human_writing_rules",
    description: "Get comprehensive rules for writing like a human and avoiding AI slop. Use these rules as system-level instructions for any text generation task.",
    inputSchema: {
      type: "object",
      properties: {
        context: {
          type: "string",
          description: "Optional: The context or type of writing (e.g., 'technical documentation', 'casual email', 'blog post')",
        },
      },
    },
  },
  {
    name: "check_for_slop",
    description: "Analyze text for AI slop indicators across three categories: Information Utility, Style Quality, and Structure. Returns specific patterns to avoid.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyze for AI slop indicators",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "get_slop_examples",
    description: "Get examples of common AI slop phrases and patterns to avoid, categorized by type.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["phrases", "structure", "tone", "all"],
          description: "The category of slop examples to retrieve",
        },
      },
    },
  },
];

// Tool execution function
async function executeTool(name: string, args: any) {

  switch (name) {
    case "get_human_writing_rules": {
      const context = args?.context || "";
      let rules = ANTI_SLOP_RULES;

      if (context) {
        rules += `\n\n## Context-Specific Guidance\n\nYou are writing: ${context}\n\nAdapt these rules to fit this context while maintaining human-like writing.`;
      }

      return {
        content: [{ type: "text", text: rules }],
      };
    }

    case "check_for_slop": {
      const text = args?.text;

      if (!text) {
        throw new Error("No text provided");
      }

      const findings: string[] = [];
      const textLower = text.toLowerCase();
      const words = text.split(/\s+/);
      const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);

      // AI Cliché Phrases (β=0.05 tone correlation)
      const aiPhrases = [
        "delve into", "it's important to note", "it's worth noting",
        "in today's digital age", "dive deep", "game changer",
        "unlock the potential", "landscape", "leverage",
        "cutting-edge", "paradigm shift", "robust", "utilize",
        "seamless", "holistic", "synergy", "ecosystem", "journey",
        "revolutionize", "transform", "empower", "facilitate"
      ];

      const foundPhrases = aiPhrases.filter((phrase: string) => textLower.includes(phrase));
      if (foundPhrases.length > 0) {
        findings.push(`Tone: AI cliché phrases - ${foundPhrases.join(", ")}`);
      }

      // Repetition (Templatedness detection)
      const starts = sentences.map((s: string) => s.trim().split(/\s+/)[0]?.toLowerCase()).filter(Boolean);
      const startCounts = starts.reduce((acc: Record<string, number>, start: string) => {
        acc[start] = (acc[start] || 0) + 1;
        return acc;
      }, {});

      const repetitiveStarts = Object.entries(startCounts)
        .filter(([_, count]) => count >= 3)
        .map(([word]) => word);

      if (repetitiveStarts.length > 0) {
        findings.push(`Repetition: Formulaic sentence starts - ${repetitiveStarts.join(", ")}`);
      }

      // Verbosity check (avg words per sentence)
      if (sentences.length > 0) {
        const avgLength = words.length / sentences.length;
        if (avgLength > 25) {
          findings.push(`Verbosity: Average ${avgLength.toFixed(1)} words/sentence (target: 15-20)`);
        }
      }

      // Word Complexity (unnecessary formal words)
      const complexWords = [
        "furthermore", "moreover", "thus", "hence", "whereby", "wherein",
        "heretofore", "aforementioned", "notwithstanding"
      ];
      const foundComplex = complexWords.filter(word => textLower.includes(word));
      if (foundComplex.length >= 2) {
        findings.push(`Word Complexity: Unnecessarily formal - ${foundComplex.join(", ")}`);
      }

      // Density check (information content)
      const uniqueWords = new Set(words.map(w => w.toLowerCase()));
      const lexicalDensity = uniqueWords.size / words.length;
      if (lexicalDensity < 0.4) {
        findings.push(`Density: Low information content (${(lexicalDensity * 100).toFixed(0)}% unique words)`);
      }

      // List-heavy structure
      const bulletPoints = (text.match(/^[\s]*[-•*]/gm) || []).length;
      const numberedLists = (text.match(/^[\s]*\d+\./gm) || []).length;
      if (bulletPoints > 5 || numberedLists > 5) {
        findings.push(`Structure: List-heavy (${bulletPoints} bullets, ${numberedLists} numbered)`);
      }

      // Bias indicators (generic/standardized language)
      const genericPhrases = ["in general", "typically", "usually", "often", "sometimes"];
      const foundGeneric = genericPhrases.filter(phrase => textLower.includes(phrase));
      if (foundGeneric.length >= 3) {
        findings.push(`Bias: Over-standardized language - ${foundGeneric.join(", ")}`);
      }

      const result = findings.length > 0
        ? `# AI Slop Analysis\n\n${findings.join("\n")}\n\nCategories based on research (β=0.05-0.06 correlation with human perception)`
        : "No AI slop detected";

      return {
        content: [{ type: "text", text: result }],
      };
    }

    case "get_slop_examples": {
      const category = args?.category || "all";
      let examples = "# AI Slop Examples to Avoid\n\n";

      if (category === "phrases" || category === "all") {
        examples += `## Overused AI Phrases\n\n`;
        examples += `Never use:\n`;
        examples += `- "delve into" → use "explore" or "examine"\n`;
        examples += `- "leverage" → use "use"\n`;
        examples += `- "utilize" → use "use"\n\n`;
      }

      if (category === "structure" || category === "all") {
        examples += `## Structural Patterns to Avoid\n\n`;
        examples += `❌ Don't:\n`;
        examples += `- Start every sentence the same way\n`;
        examples += `- Make everything a bulleted list\n\n`;
      }

      return {
        content: [{ type: "text", text: examples }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET requests for SSE stream (optional server-to-client notifications)
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send initial connection event
    res.write('event: open\n');
    res.write('data: {"type":"connection","status":"connected"}\n\n');
    
    // Keep connection alive with periodic pings
    const keepAlive = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 30000);
    
    req.on('close', () => {
      clearInterval(keepAlive);
      res.end();
    });
    
    return;
  }

  // Handle POST requests for JSON-RPC messages
  if (req.method === 'POST') {
    try {
      const message = req.body;

      // Validate JSON-RPC
      if (!message.jsonrpc || message.jsonrpc !== "2.0") {
        res.status(400).json({ 
          jsonrpc: "2.0", 
          id: message.id || null, 
          error: { code: -32600, message: "Invalid JSON-RPC version" } 
        });
        return;
      }

      // Handle initialize request
      if (message.method === "initialize") {
        res.json({
          jsonrpc: "2.0",
          id: message.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: "talkhuman-mcp",
              version: "1.0.0",
            },
          },
        });
        return;
      }

      // Handle notifications (no response needed)
      if (message.method === "notifications/initialized") {
        res.status(200).end();
        return;
      }

      // Handle tools/list
      if (message.method === "tools/list") {
        res.json({
          jsonrpc: "2.0",
          id: message.id,
          result: { tools: TOOLS },
        });
        return;
      }

      // Handle tools/call
      if (message.method === "tools/call") {
        const { name, arguments: args } = message.params;
        const result = await executeTool(name, args);
        res.json({
          jsonrpc: "2.0",
          id: message.id,
          result,
        });
        return;
      }

      // Unknown method
      res.json({
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32601, message: `Method not found: ${message.method}` },
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        jsonrpc: "2.0",
        id: req.body?.id || null,
        error: { 
          code: -32603, 
          message: error.message || "Internal error" 
        },
      });
      return;
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
