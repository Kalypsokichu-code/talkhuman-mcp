#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ANTI_SLOP_RULES } from "./rules.js";

// Create and configure the MCP server
const server = new McpServer({
  name: "talkhuman-mcp",
  version: "1.0.0",
});

// Register: Get Human Writing Rules
server.registerTool(
  "get_human_writing_rules",
  {
    title: "Get Human Writing Rules",
    description:
      "Get comprehensive rules for writing like a human and avoiding AI slop. Use these rules as system-level instructions for any text generation task.",
    inputSchema: {
      context: z
        .string()
        .optional()
        .describe(
          "Optional: The context or type of writing (e.g., 'technical documentation', 'casual email', 'blog post')"
        ),
    },
  },
  async ({ context }) => {
    let rules = ANTI_SLOP_RULES;

    if (context) {
      rules = `# Context: ${context}\n\n${rules}`;
    }

    return {
      content: [{ type: "text", text: rules }],
    };
  }
);

// Register: Check for AI Slop
server.registerTool(
  "check_for_slop",
  {
    title: "Check for AI Slop",
    description:
      "Analyze text for AI slop indicators across three categories: Information Utility, Style Quality, and Structure. Returns specific patterns to avoid.",
    inputSchema: {
      text: z.string().describe("The text to analyze for AI slop indicators"),
    },
  },
  async ({ text }) => {
    const findings: string[] = [];
    const textLower = text.toLowerCase();
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    // Check for common AI slop phrases
    const slopPhrases = [
      "it's worth noting",
      "it's important to note",
      "as previously mentioned",
      "in conclusion",
      "in summary",
      "delve into",
      "dive into",
      "let's explore",
      "unpack",
      "multifaceted",
      "holistic approach",
      "leverage",
      "paradigm shift",
      "synergy",
      "robust solution",
      "cutting-edge",
      "state-of-the-art",
    ];

    const foundPhrases = slopPhrases.filter((phrase) =>
      textLower.includes(phrase)
    );
    if (foundPhrases.length > 0) {
      findings.push(
        `Overused Phrases: Found AI clichés - ${foundPhrases.join(", ")}`
      );
    }

    // Check for repetitive sentence starts
    const startCounts: Record<string, number> = sentences.reduce(
      (acc, sentence) => {
        const firstWord = sentence.trim().split(/\s+/)[0]?.toLowerCase();
        if (firstWord && firstWord.length > 3) {
          acc[firstWord] = (acc[firstWord] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const repetitiveStarts = Object.entries(startCounts)
      .filter(([_, count]) => (count as number) >= 3)
      .map(([word]) => word);

    if (repetitiveStarts.length > 0) {
      findings.push(
        `Repetition: Formulaic sentence starts - ${repetitiveStarts.join(", ")}`
      );
    }

    // Verbosity check (avg words per sentence)
    const avgWordsPerSentence = words.length / sentences.length;
    if (avgWordsPerSentence > 25) {
      findings.push(
        `Verbosity: Overly long sentences (avg ${avgWordsPerSentence.toFixed(1)} words)`
      );
    }

    // Check for hedging language
    const hedgingWords = [
      "perhaps",
      "possibly",
      "might",
      "could potentially",
      "somewhat",
      "fairly",
      "relatively",
      "generally",
    ];
    const foundHedging = hedgingWords.filter((word) =>
      textLower.includes(word)
    );
    if (foundHedging.length > 2) {
      findings.push(
        `Hedging: Excessive uncertainty language - ${foundHedging.join(", ")}`
      );
    }

    // Check for overly complex words when simple ones exist
    const complexityPairs = [
      { complex: "utilize", simple: "use" },
      { complex: "facilitate", simple: "help" },
      { complex: "demonstrate", simple: "show" },
      { complex: "indicate", simple: "show" },
      { complex: "commence", simple: "start" },
    ];

    const foundComplex = complexityPairs
      .filter((pair) => textLower.includes(pair.complex))
      .map((pair) => `"${pair.complex}" → "${pair.simple}"`);

    if (foundComplex.length > 0) {
      findings.push(
        `Word Complexity: Unnecessarily formal - ${foundComplex.join(", ")}`
      );
    }

    // Density check (information content)
    const uniqueWords = new Set(words.map((w: string) => w.toLowerCase()));
    const lexicalDensity = uniqueWords.size / words.length;
    if (lexicalDensity < 0.4) {
      findings.push(
        `Density: Low information content (${(lexicalDensity * 100).toFixed(0)}% unique words)`
      );
    }

    const resultText =
      findings.length > 0
        ? `## AI Slop Analysis\n\n${findings.map((f) => `- ${f}`).join("\n")}\n\n**Recommendation:** Revise to be more concise, direct, and natural.`
        : "✅ No major AI slop patterns detected. Text appears natural and concise.";

    return {
      content: [{ type: "text", text: resultText }],
    };
  }
);

// Register: Get Slop Examples
server.registerTool(
  "get_slop_examples",
  {
    title: "Get Slop Examples",
    description:
      "Get examples of common AI slop phrases and patterns to avoid, categorized by type.",
    inputSchema: {
      category: z
        .enum(["phrases", "structure", "tone", "all"])
        .optional()
        .describe("The category of slop examples to retrieve"),
    },
  },
  async ({ category }) => {
    const cat = category || "all";
    let examples = "# AI Slop Examples to Avoid\n\n";

    if (cat === "phrases" || cat === "all") {
      examples += `## Overused Phrases
- "It's worth noting that..."
- "It's important to note that..."
- "As previously mentioned..."
- "In conclusion / In summary..."
- "Let's delve into / dive into..."
- "Unpack this concept..."
- "Leverage [anything]..."
- "Robust solution..."
- "Cutting-edge / State-of-the-art..."

`;
    }

    if (cat === "structure" || cat === "all") {
      examples += `## Structural Patterns to Avoid
- Starting every sentence the same way
- Using 3-item lists for everything
- Excessive bullet points
- Over-explaining simple concepts
- Adding unnecessary context

`;
    }

    if (cat === "tone" || cat === "all") {
      examples += `## Tone Issues
- Overly formal when casual is appropriate
- Hedging language (perhaps, possibly, might)
- False enthusiasm ("exciting opportunity!")
- Corporate jargon overload
- Pretending to be human ("As an AI...")

`;
    }

    return {
      content: [{ type: "text", text: examples }],
    };
  }
);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TalkHuman MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
