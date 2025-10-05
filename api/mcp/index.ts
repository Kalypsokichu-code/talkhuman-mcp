import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { ANTI_SLOP_RULES } from "../../src/rules.js";

// Create MCP handler with tools
const handler = createMcpHandler(
  (server) => {
    // Tool 1: Get human writing rules
    server.tool(
      "get_human_writing_rules",
      "Get comprehensive rules for writing like a human and avoiding AI slop. Use these rules as system-level instructions for any text generation task.",
      {
        context: z.string().optional().describe("Optional: The context or type of writing (e.g., 'technical documentation', 'casual email', 'blog post')"),
      },
      async ({ context }) => {
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
    );

    // Tool 2: Check for slop
    server.tool(
      "check_for_slop",
      "Analyze text for AI slop indicators across three categories: Information Utility, Style Quality, and Structure. Returns specific patterns to avoid.",
      {
        text: z.string().describe("The text to analyze for AI slop indicators"),
      },
      async ({ text }) => {
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

        // Check average sentence length
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
    );

    // Tool 3: Get slop examples
    server.tool(
      "get_slop_examples",
      "Get examples of common AI slop phrases and patterns to avoid, categorized by type.",
      {
        category: z.enum(["phrases", "structure", "tone", "all"]).optional().describe("The category of slop examples to retrieve"),
      },
      async ({ category = "all" }) => {
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
    );
  },
  {
    // Server capabilities
    capabilities: {
      tools: {},
    },
  },
  {
    // Handler configuration
    basePath: "/api/mcp",
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
