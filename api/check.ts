import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { text } = req.body;

  if (!text) {
    res.status(400).json({ error: "No text provided for analysis" });
    return;
  }

  const findings: string[] = [];
  const textLower = text.toLowerCase();

  // Check for AI cliché phrases
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
  ];

  const foundPhrases = aiPhrases.filter((phrase) => textLower.includes(phrase));
  if (foundPhrases.length > 0) {
    findings.push(`⚠️ AI Cliché Phrases Found: ${foundPhrases.join(", ")}`);
  }

  // Check for repetitive starts
  const sentences = text
    .split(/[.!?]+/)
    .filter((s: string) => s.trim().length > 0);
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
    .filter(([_, count]) => count >= 3)
    .map(([word]) => word);

  if (repetitiveStarts.length > 0) {
    findings.push(
      `⚠️ Repetitive Sentence Starts: ${repetitiveStarts.join(", ")}`
    );
  }

  // Check for excessive formality markers
  const formalityMarkers = [
    "furthermore",
    "moreover",
    "thus",
    "hence",
    "whereby",
    "wherein",
  ];
  const foundFormality = formalityMarkers.filter((marker) =>
    textLower.includes(marker)
  );
  if (foundFormality.length >= 2) {
    findings.push(`⚠️ Overly Formal: ${foundFormality.join(", ")}`);
  }

  // Check for list-heavy structure
  const bulletPoints = (text.match(/^[\s]*[-•*]/gm) || []).length;
  const numberedLists = (text.match(/^[\s]*\d+\./gm) || []).length;
  if (bulletPoints > 5 || numberedLists > 5) {
    findings.push(
      `⚠️ List-Heavy Structure: ${bulletPoints} bullets, ${numberedLists} numbered items`
    );
  }

  // Check average sentence length
  if (sentences.length > 0) {
    const avgLength = text.split(/\s+/).length / sentences.length;
    if (avgLength > 25) {
      findings.push(
        `⚠️ Long Sentences: Average ${avgLength.toFixed(1)} words (aim for 15-20)`
      );
    }
  }

  const result = {
    hasSlop: findings.length > 0,
    findings,
    message:
      findings.length > 0
        ? "AI slop detected. Revise the text to sound more human and natural."
        : "No obvious AI slop detected. Text appears human-like.",
  };

  res.status(200).json(result);
}
