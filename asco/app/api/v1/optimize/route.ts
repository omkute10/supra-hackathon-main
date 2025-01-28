// app/api/optimize/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Response schema type definition
type OptimizationResponse = {
  optimizedCode: string;
  metrics: {
    gas: string;       // Format: "X% savings - reason"
    security: string[];// Array of security findings
    performance: string;// Performance improvement description
  };
  warnings?: string[]; // Optional array of warnings
  analysis: {
    level: 'basic' | 'advanced' | 'full';
    goals: ('gas' | 'security' | 'performance' | 'readability')[];
  };
};

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// Original system message preserved exactly
const SYSTEM_MESSAGES = [
  {
    role: "system",
    content: `You are a Move language optimizer. RESPONSE MUST CONTAIN:
    1. Optimized code with EXACTLY these inline comments:
       - // GAS: [X]% savings - [reason]
       - // SECURITY: [finding]
       - // PERFORMANCE: [improvement]
    2. Version header: // OPTIMIZED AT: [timestamp]
    3. No explanations outside code comments
    4. Preserve original functionality
    5. Follow Supra blockchain conventions`
  },
  {
    role: "system",
    content: "Ensure all responses follow strict semantic versioning and include detailed gas estimations."
  }
];

const METRIC_PATTERNS = {
  gas: /\/\/ GAS: (.+?)(?:\n|$)/,
  security: /\/\/ SECURITY: (.+?)(?:\n|$)/g,
  performance: /\/\/ PERFORMANCE: (.+?)(?:\n|$)/
};

export async function POST(request: Request) {
  try {
    const { moveCode, optimizationGoals = ['gas'], analysisLevel = 'advanced' } = await request.json();

    if (!moveCode?.match(/module\s+\w+\s*{/)) {
      return NextResponse.json({ error: 'Invalid Move module structure' }, { status: 400 });
    }

    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        ...SYSTEM_MESSAGES,
        {
          role: "user",
          content: `OPTIMIZE THIS MOVE CODE (${analysisLevel} analysis):
    FOCUS ON: ${optimizationGoals.join(', ')}
    
    CODE:
    ${moveCode}`
        }
      ],
      temperature: 0.1,
      max_tokens: 2500
    });

    const optimizedCode = completion.choices[0]?.message?.content?.trim();
    
    if (!optimizedCode || !METRIC_PATTERNS.gas.test(optimizedCode)) {
      throw new Error('Invalid optimization response');
    }

    // Construct response following the defined schema
    const response: OptimizationResponse = {
      optimizedCode,
      metrics: {
        gas: optimizedCode.match(METRIC_PATTERNS.gas)?.[1] || '0%',
        security: [...optimizedCode.matchAll(METRIC_PATTERNS.security)].map(m => m[1]),
        performance: optimizedCode.match(METRIC_PATTERNS.performance)?.[1] || 'No improvement'
      },
      analysis: {
        level: analysisLevel,
        goals: optimizationGoals
      }
    };

    // Add warnings if they exist
    const warnings = [];
    if (optimizedCode.includes('UNSAFE')) warnings.push('Contains unsafe operations');
    if (optimizedCode.includes('WARNING')) warnings.push('Contains compiler warnings');
    if (warnings.length > 0) {
      response.warnings = warnings;
    }

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Optimization failed' },
      { status: 500 }
    );
  }
}