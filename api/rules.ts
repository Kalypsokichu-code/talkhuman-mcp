import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ANTI_SLOP_RULES } from '../src/rules.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');

  if (req.method === 'GET') {
    const context = req.query.context as string;
    let rules = ANTI_SLOP_RULES;

    if (context) {
      rules += `\n\n## Context-Specific Guidance\n\nYou are writing: ${context}\n\nAdapt these rules to fit this context while maintaining human-like writing.`;
    }

    res.status(200).send(rules);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
