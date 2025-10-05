#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { ANTI_SLOP_RULES, SLOP_INDICATORS } from "./rules.js";

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

const server = new Server(
  {
    name: "talkhuman-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_human_writing_rules": {
      const context = (args?.context as string) || "";
      let rules = ANTI_SLOP_RULES;

      if (context) {
        rules += `\n\n## Context-Specific Guidance\n\nYou are writing: ${context}\n\nAdapt these rules to fit this context while maintaining human-like writing.`;
      }

      return {
        content: [
          {
            type: "text",
            text: rules,
          },
        ],
      };
    }

    case "check_for_slop": {
      const text = args?.text as string;

      if (!text) {
        return {
          content: [
            {
              type: "text",
              text: "Error: No text provided for analysis",
            },
          ],
          isError: true,
        };
      }

      const findings: string[] = [];
      const textLower = text.toLowerCase();

      // Check for AI cliché phrases
      const aiPhrases = [
        "delve into", "it's important to note", "it's worth noting",
        "in today's digital age", "dive deep", "game changer",
        "unlock the potential", "landscape", "leverage",
        "cutting-edge", "paradigm shift", "robust", "utilize",
        "seamless", "holistic", "synergy", "ecosystem", "journey"
      ];

      const foundPhrases = aiPhrases.filter(phrase => textLower.includes(phrase));
      if (foundPhrases.length > 0) {
        findings.push(`⚠️ AI Cliché Phrases Found: ${foundPhrases.join(", ")}`);
      }

      // Check for repetitive starts
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const starts = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase()).filter(Boolean);
      const startCounts = starts.reduce((acc, start) => {
        acc[start] = (acc[start] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const repetitiveStarts = Object.entries(startCounts)
        .filter(([_, count]) => count >= 3)
        .map(([word]) => word);

      if (repetitiveStarts.length > 0) {
        findings.push(`⚠️ Repetitive Sentence Starts: ${repetitiveStarts.join(", ")}`);
      }

      // Check for excessive formality markers
      const formalityMarkers = ["furthermore", "moreover", "thus", "hence", "whereby", "wherein"];
      const foundFormality = formalityMarkers.filter(marker => textLower.includes(marker));
      if (foundFormality.length >= 2) {
        findings.push(`⚠️ Overly Formal: ${foundFormality.join(", ")}`);
      }

      // Check for list-heavy structure
      const bulletPoints = (text.match(/^[\s]*[-•*]/gm) || []).length;
      const numberedLists = (text.match(/^[\s]*\d+\./gm) || []).length;
      if (bulletPoints > 5 || numberedLists > 5) {
        findings.push(`⚠️ List-Heavy Structure: ${bulletPoints} bullets, ${numberedLists} numbered items`);
      }

      // Check average sentence length (very long = AI tendency)
      if (sentences.length > 0) {
        const avgLength = text.split(/\s+/).length / sentences.length;
        if (avgLength > 25) {
          findings.push(`⚠️ Long Sentences: Average ${avgLength.toFixed(1)} words (aim for 15-20)`);
        }
      }

      const result = findings.length > 0
        ? `# AI Slop Analysis\n\n${findings.join("\n\n")}\n\n## Recommendation\nRevise the text to sound more human and natural.`
        : "✅ No obvious AI slop detected. Text appears human-like.";

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    }

    case "get_slop_examples": {
      const category = (args?.category as string) || "all";

      let examples = "# AI Slop Examples to Avoid\n\n";

      if (category === "phrases" || category === "all") {
        examples += `## Overused AI Phrases\n\n`;
        examples += `Never use:\n`;
        examples += `- "delve into" → use "explore" or "examine"\n`;
        examples += `- "leverage" → use "use"\n`;
        examples += `- "utilize" → use "use"\n`;
        examples += `- "it's important to note that" → just state it\n`;
        examples += `- "in today's digital age" → be specific or omit\n`;
        examples += `- "game changer" → be specific about impact\n`;
        examples += `- "robust" → use concrete descriptors\n`;
        examples += `- "seamless" → describe actual experience\n`;
        examples += `- "ecosystem" → unless discussing biology\n\n`;
      }

      if (category === "structure" || category === "all") {
        examples += `## Structural Patterns to Avoid\n\n`;
        examples += `❌ Don't:\n`;
        examples += `- Start every sentence the same way\n`;
        examples += `- Use "Firstly, Secondly, Thirdly" unless truly needed\n`;
        examples += `- Make everything a bulleted list\n`;
        examples += `- Begin with "Certainly!" or "Absolutely!"\n`;
        examples += `- End with summary of what you just said\n\n`;
        examples += `✅ Do:\n`;
        examples += `- Vary sentence structure naturally\n`;
        examples += `- Mix short and long sentences\n`;
        examples += `- Use paragraphs for flow, lists when truly helpful\n`;
        examples += `- Get straight to the point\n\n`;
      }

      if (category === "tone" || category === "all") {
        examples += `## Tone Issues\n\n`;
        examples += `❌ Too AI-like:\n`;
        examples += `"It's worth noting that one should carefully consider..."\n\n`;
        examples += `✅ Human-like:\n`;
        examples += `"Consider..."\n\n`;
        examples += `❌ Over-hedging:\n`;
        examples += `"This might potentially be somewhat useful in certain scenarios..."\n\n`;
        examples += `✅ Direct:\n`;
        examples += `"This is useful when..."\n\n`;
      }

      if (category === "all") {
        examples += `## The Golden Test\n\n`;
        examples += `Ask yourself: "Would a human actually write this?"\n`;
        examples += `If it sounds like corporate jargon or a press release, revise it.\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: examples,
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TalkHuman MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
