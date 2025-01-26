import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type OptimizationRequest = {
  moveCode: string;
  optimizationGoals?: string[];
  analysisLevel?: 'basic' | 'advanced' | 'full';
};

type OptimizationResponse = {
  optimizedCode: string;
  metrics: {
    gasSavings: string;
    securityFindings: string[];
    performanceImprovement: string;
  };
  warnings?: string[];
  analysisLevel: string;
};

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const buildOptimizationPrompt = (
  request: OptimizationRequest
): OpenAI.ChatCompletionMessageParam[] => [
  {
    role: "system",
    content: `You are a Move language optimization expert specializing in blockchain smart contracts. 
      Provide detailed optimizations with:
      - Gas efficiency improvements
      - Security enhancements
      - Performance optimizations
      - Readability improvements
      Include inline comments explaining changes.`
  },
  {
    role: "user",
    content: `Optimize this Move contract with ${request.analysisLevel} analysis:
      Optimization focus: ${request.optimizationGoals?.join(', ') || 'gas_efficiency'}
      
      Code to optimize:
      ${request.moveCode}`
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OptimizationResponse | { error: string }>
) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { moveCode, optimizationGoals = [], analysisLevel = 'advanced' } = req.body;

    // Basic validation
    if (!moveCode || typeof moveCode !== 'string' || moveCode.length < 50) {
      return res.status(400).json({ error: 'Valid Move code (minimum 50 characters) is required' });
    }

    if (!Array.isArray(optimizationGoals) || optimizationGoals.some(g => typeof g !== 'string')) {
      return res.status(400).json({ error: 'Invalid optimization goals format' });
    }

    // Generate optimization
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: buildOptimizationPrompt({
        moveCode,
        optimizationGoals,
        analysisLevel
      }),
      temperature: 0.3,
      max_tokens: 2000
    });

    const optimizedCode = completion.choices[0]?.message?.content || '';

    // Validate response structure
    if (!optimizedCode.includes('module') || !optimizedCode.includes('fun')) {
      return res.status(500).json({ error: 'Invalid optimization response format' });
    }

    // Extract metrics from comments
    const gasSavings = optimizedCode.match(/\/\/ Gas savings: (.*?)\n/)?.[1] || 'Not quantified';
    const securityFindings = [...optimizedCode.matchAll(/\/\/ Security: (.*?)\n/g)]
      .map(m => m[1]);
    const performanceImprovement = optimizedCode.match(/\/\/ Performance: (.*?)\n/)?.[1] || 'Not quantified';

    // Generate warnings
    const warnings = [];
    if (optimizedCode.includes('unsafe')) warnings.push('Contains unsafe operations');
    if (optimizedCode.includes('TODO')) warnings.push('Contains TODO comments');

    return res.status(200).json({
      optimizedCode,
      metrics: {
        gasSavings,
        securityFindings,
        performanceImprovement
      },
      warnings: warnings.length > 0 ? warnings : undefined,
      analysisLevel
    });

  } catch (error) {
    console.error('Optimization error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to optimize code';
    return res.status(500).json({ error: errorMessage });
  }
}