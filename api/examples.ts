import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/plain");

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const category = (req.query.category as string) || "all";

  let examples = "# AI Slop Examples to Avoid\n\n";

  if (category === "phrases" || category === "all") {
    examples += "## Overused AI Phrases\n\n";
    examples += "Never use:\n";
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
    examples += "## Structural Patterns to Avoid\n\n";
    examples += `❌ Don't:\n`;
    examples += "- Start every sentence the same way\n";
    examples += `- Use "Firstly, Secondly, Thirdly" unless truly needed\n`;
    examples += "- Make everything a bulleted list\n";
    examples += `- Begin with "Certainly!" or "Absolutely!"\n`;
    examples += "- End with summary of what you just said\n\n";
    examples += "✅ Do:\n";
    examples += "- Vary sentence structure naturally\n";
    examples += "- Mix short and long sentences\n";
    examples += "- Use paragraphs for flow, lists when truly helpful\n";
    examples += "- Get straight to the point\n\n";
  }

  if (category === "tone" || category === "all") {
    examples += "## Tone Issues\n\n";
    examples += "❌ Too AI-like:\n";
    examples += `"It's worth noting that one should carefully consider..."\n\n`;
    examples += "✅ Human-like:\n";
    examples += `"Consider..."\n\n`;
    examples += "❌ Over-hedging:\n";
    examples += `"This might potentially be somewhat useful in certain scenarios..."\n\n`;
    examples += "✅ Direct:\n";
    examples += `"This is useful when..."\n\n`;
  }

  if (category === "all") {
    examples += "## The Golden Test\n\n";
    examples += `Ask yourself: "Would a human actually write this?"\n`;
    examples +=
      "If it sounds like corporate jargon or a press release, revise it.\n";
  }

  res.status(200).send(examples);
}
