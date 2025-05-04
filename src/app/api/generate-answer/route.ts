import { NextRequest, NextResponse } from 'next/server';
// import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_OPENROUTER_MODEL } from '@/lib/config';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { course, category, lesson, message, lecture } = await req.json();

  // TODO: Make db pivot table uuid -> model so premium users can use gpt-3.5-turbo model
  const model = 'deepseek/deepseek-chat-v3-0324:free';
  // const model = 'gpt-3.5-turbo';
  // const model = 'thudm/glm-z1-9b:free';
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an ${category} expert educator teaching about ${course} and you are answering a students question coresponding to lecture ${lesson} and here is the lecture you are answering: ${lecture}`
        },
        {
          role: 'user',
          content: message
        }
      ]
    }, {
      headers: {
      // TODO: FIX ENV AND HIDE TOKEN BEFORE PUSH TO GITHUB
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    return NextResponse.json({ answer: response.data.choices[0].message.content });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json({ error: 'Failed to generate answer.' }, { status: 500 });
  }
}
