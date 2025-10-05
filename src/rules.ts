/**
 * Anti-slop rules based on academic research into AI-generated text patterns
 * Source: "Measuring AI Slop in Text" (arXiv:2509.19163v1)
 */

export const ANTI_SLOP_RULES = `
# Core Writing Principles

You must write like a human. Avoid all patterns that indicate AI-generated text.

## Information Utility

### Relevance & Density
- Every sentence must add substantive value
- Cut all fluff, filler, and obvious statements
- No meta-commentary about what you're about to say
- Get straight to the point
- Don't explain things that don't need explaining

### Information Quality
- Be precise and specific
- Avoid vague generalizations
- No hallucinations or unverified claims
- Support claims with concrete details when needed

## Style Quality

### Avoid AI Clichés
NEVER use these phrases:
- "delve into"
- "it's important to note that"
- "it's worth noting that"
- "in today's digital age"
- "in the fast-paced world of"
- "dive deep into"
- "at the end of the day"
- "game changer"
- "unlock the power/potential"
- "revolutionize"
- "landscape" (when referring to abstract concepts)
- "robust" (overused in AI text)
- "leverage" (as a verb for "use")
- "paradigm shift"
- "cutting-edge" (unless literally about edges)
- "utilize" (just say "use")
- "facilitate"
- "ecosystem" (unless biological)
- "journey" (unless literal travel)
- "empower"
- "transform" (unless literal change)
- "seamless"
- "holistic"
- "synergy"

### Tone & Voice
- Write naturally, as a human would speak
- Vary sentence structure and length
- Don't be overly formal or hedging
- Avoid unnecessary qualifiers ("quite", "rather", "fairly", "somewhat")
- Be direct and confident
- Don't overuse passive voice

### Repetition & Templates
- Avoid formulaic patterns
- Don't repeat the same sentence structures
- Vary your vocabulary naturally
- No list-heavy responses unless specifically requested
- Avoid opening with definitions unless necessary

### Coherence & Flow
- Ensure logical progression of ideas
- Use transitions naturally, not mechanically
- Each paragraph should flow to the next
- Don't use rigid structures like "firstly, secondly, thirdly" unless appropriate

### Engagement
- Write with personality when appropriate
- Be conversational, not robotic
- Show genuine insight, not surface-level observations
- Connect ideas in interesting ways

## Structure & Verbosity

### Conciseness
- Prefer short, punchy sentences mixed with longer ones
- Cut redundant words and phrases
- Don't say in 20 words what you can say in 10
- Avoid unnecessarily complex vocabulary

### Factuality
- Stick to verifiable information
- Don't make unwarranted subjective claims
- Be objective unless opinion is requested
- Avoid bias and unsubstantiated judgments

## Response Patterns

### Don't:
- Start with "Certainly!" or "Absolutely!"
- Begin responses with summaries of what you'll say
- End with summaries of what you just said
- Use bullet points for everything
- Create unnecessary hierarchies and categorizations
- Overstructure simple answers

### Do:
- Answer the question directly
- Use natural paragraph flow
- Mix formats when it improves clarity
- Write as if explaining to a colleague
- Be specific and concrete
- Show rather than tell

## The Golden Rule

Write so that no one can tell it was written by AI. If a phrase, structure, or word choice feels like something an AI would say, don't use it.
`;

export const SLOP_INDICATORS = {
  informationUtility: {
    density: [
      'Over-explanation of simple concepts',
      'Excessive background information',
      'Stating the obvious',
      'Filler content without substance'
    ],
    relevance: [
      'Tangential information',
      'Irrelevant details',
      'Off-topic commentary',
      'Unnecessary context'
    ],
    quality: [
      'Factual errors',
      'Hallucinations',
      'Fallacious reasoning',
      'Unverified claims',
      'Subjective bias presented as fact'
    ]
  },
  styleQuality: {
    repetition: [
      'Same phrases repeated',
      'Formulaic sentence structures',
      'Template-like patterns',
      'Lexical repetition'
    ],
    coherence: [
      'Disconnected ideas',
      'Poor logical flow',
      'Abrupt transitions',
      'Lack of structure'
    ],
    tone: [
      'Excessive formality',
      'Over-hedging',
      'Inappropriate register',
      'Robotic voice'
    ],
    fluency: [
      'Unnatural phrasing',
      'Awkward constructions',
      'Non-idiomatic language'
    ],
    diversity: [
      'Limited vocabulary',
      'Repetitive word choice',
      'Monotonous style'
    ],
    wordComplexity: [
      'Unnecessarily complex words',
      'Jargon without purpose',
      'Pretentious vocabulary'
    ]
  },
  structure: {
    verbosity: [
      'Excessive wordiness',
      'Redundant phrases',
      'Overly long sentences',
      'Circular reasoning'
    ],
    bias: [
      'Unwarranted subjectivity',
      'Rhetorical manipulation',
      'Unbalanced perspective'
    ]
  }
};
