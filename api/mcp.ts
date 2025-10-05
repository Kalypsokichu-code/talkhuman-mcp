import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z, type ZodTypeAny } from "zod";
import { ANTI_SLOP_RULES } from "../src/rules.js";

// Create and configure a new MCP server instance for this request
function createServer(): McpServer {
  const server = new McpServer({
    name: "talkhuman-mcp",
    version: "1.0.0",
  });

  // Register tool: get_human_writing_rules
  server.registerTool(
    "get_human_writing_rules",
    {
      title: "Get Human Writing Rules",
      description:
        "Get comprehensive rules for writing like a human and avoiding AI slop. Use these rules as system-level instructions for any text generation task.",
      inputSchema: z.object({
        context: z
          .string()
          .optional()
          .describe(
            "Optional: The context or type of writing (e.g., 'technical documentation', 'casual email', 'blog post')"
          ),
      }) as ZodTypeAny,
    },
    async ({ context }) => {
      let rules = ANTI_SLOP_RULES;

      if (context) {
        rules += `\n\n## Context-Specific Guidance\n\nYou are writing: ${context}\n\nAdapt these rules to fit this context while maintaining human-like writing.`;
      }

      return {
        content: [{ type: "text", text: rules }],
      };
    }
  );

  // Register tool: check_for_slop
  server.registerTool(
    "check_for_slop",
    {
      title: "Check for AI Slop",
      description:
        "Analyze text for AI slop indicators across three categories: Information Utility, Style Quality, and Structure. Returns specific patterns to avoid.",
      inputSchema: z.object({
        text: z.string().describe("The text to analyze for AI slop indicators"),
      }) as ZodTypeAny,
    },
    async ({ text }) => {
      const findings: string[] = [];
      const textLower = text.toLowerCase();
      const words = text.split(/\s+/);
      const sentences = text
        .split(/[.!?]+/)
        .filter((s: string) => s.trim().length > 0);

      // AI Cliché Phrases (β=0.05 tone correlation)
      const aiPhrases = [
        "delve into",
        "it's important to note",
        "it's worth noting",
        "in today's digital age",
        "dive deep",
        "game changer",
        "unlock the potential",
        "landscape",
        "leverage",
        "cutting-edge",
        "paradigm shift",
        "robust",
        "utilize",
        "seamless",
        "holistic",
        "synergy",
        "ecosystem",
        "journey",
        "revolutionize",
        "transform",
        "empower",
        "facilitate",
      ];

      const foundPhrases = aiPhrases.filter((phrase: string) =>
        textLower.includes(phrase)
      );
      if (foundPhrases.length > 0) {
        findings.push(`Tone: AI cliché phrases - ${foundPhrases.join(", ")}`);
      }

      // Repetition (Templatedness detection)
      const starts = sentences
        .map((s: string) => s.trim().split(/\s+/)[0]?.toLowerCase())
        .filter(Boolean);
      const startCounts = starts.reduce(
        (acc: Record<string, number>, start: string) => {
          acc[start] = (acc[start] || 0) + 1;
          return acc;
        },
        {}
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
      if (sentences.length > 0) {
        const avgLength = words.length / sentences.length;
        if (avgLength > 25) {
          findings.push(
            `Verbosity: Average ${avgLength.toFixed(1)} words/sentence (target: 15-20)`
          );
        }
      }

      // Word Complexity (unnecessary formal words)
      const complexWords = [
        "furthermore",
        "moreover",
        "thus",
        "hence",
        "whereby",
        "wherein",
        "heretofore",
        "aforementioned",
        "notwithstanding",
      ];
      const foundComplex = complexWords.filter((word) =>
        textLower.includes(word)
      );
      if (foundComplex.length >= 2) {
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

      // List-heavy structure
      const bulletPoints = (text.match(/^[\s]*[-•*]/gm) || []).length;
      const numberedLists = (text.match(/^[\s]*\d+\./gm) || []).length;
      if (bulletPoints > 5 || numberedLists > 5) {
        findings.push(
          `Structure: List-heavy (${bulletPoints} bullets, ${numberedLists} numbered)`
        );
      }

      // Bias indicators (generic/standardized language)
      const genericPhrases = [
        "in general",
        "typically",
        "usually",
        "often",
        "sometimes",
      ];
      const foundGeneric = genericPhrases.filter((phrase) =>
        textLower.includes(phrase)
      );
      if (foundGeneric.length >= 3) {
        findings.push(
          `Bias: Over-standardized language - ${foundGeneric.join(", ")}`
        );
      }

      const result =
        findings.length > 0
          ? `# AI Slop Analysis\n\n${findings.join("\n")}\n\nCategories based on research (β=0.05-0.06 correlation with human perception)`
          : "No AI slop detected";

      return {
        content: [{ type: "text", text: result }],
      };
    }
  );

  // Register tool: get_slop_examples
  server.registerTool(
    "get_slop_examples",
    {
      title: "Get Slop Examples",
      description:
        "Get examples of common AI slop phrases and patterns to avoid, categorized by type.",
      inputSchema: z.object({
        category: z
          .enum(["phrases", "structure", "tone", "all"])
          .optional()
          .describe("The category of slop examples to retrieve"),
      }) as ZodTypeAny,
    },
    async ({ category }) => {
      const cat = category || "all";
      let examples = "# AI Slop Examples to Avoid\n\n";

      if (cat === "phrases" || cat === "all") {
        examples += "## Overused AI Phrases\n\n";
        examples += "Never use:\n";
        examples += `- "delve into" → use "explore" or "examine"\n`;
        examples += `- "leverage" → use "use"\n`;
        examples += `- "utilize" → use "use"\n\n`;
      }

      if (cat === "structure" || cat === "all") {
        examples += "## Structural Patterns to Avoid\n\n";
        examples += `❌ Don't:\n`;
        examples += "- Start every sentence the same way\n";
        examples += "- Make everything a bulleted list\n\n";
      }

      return {
        content: [{ type: "text", text: examples }],
      };
    }
  );

  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers - required for browser-based MCP clients
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only POST requests are supported in stateless mode
  if (req.method === "POST") {
    try {
      // Validate that we have a request body
      if (!req.body || typeof req.body !== "object") {
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32_700,
            message: "Parse error: Invalid or missing request body",
          },
          id: null,
        });
        return;
      }

      // In stateless mode, create a new instance of transport and server for each request
      // to ensure complete isolation. A single instance would cause request ID collisions
      // when multiple clients connect concurrently.
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // Stateless mode - no session management
      });

      const server = createServer();

      // Clean up on request close
      res.on("close", () => {
        transport.close();
        server.close();
      });

      // Connect server to transport
      await server.connect(transport);

      // Handle the MCP request
      await transport.handleRequest(req, res, req.body);
    } catch (error: any) {
      // Only send error response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32_603,
            message: error.message || "Internal server error",
          },
          id: req.body?.id || null,
        });
      }
    }
    return;
  }

  // SSE notifications not supported in stateless mode
  if (req.method === "GET") {
    res.status(405).json({
      jsonrpc: "2.0",
      error: {
        code: -32_000,
        message:
          "Method not allowed. This server runs in stateless mode and does not support SSE notifications.",
      },
      id: null,
    });
    return;
  }

  // Session termination not needed in stateless mode
  if (req.method === "DELETE") {
    res.status(405).json({
      jsonrpc: "2.0",
      error: {
        code: -32_000,
        message:
          "Method not allowed. This server runs in stateless mode without session management.",
      },
      id: null,
    });
    return;
  }

  res.status(405).json({
    error: "Method not allowed. Only POST requests are supported.",
  });
}
