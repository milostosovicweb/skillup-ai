import { NextRequest, NextResponse } from 'next/server';
import { API_URL, OPENROUTER_MODEL, OPENROUTER_API_KEY } from '@/lib/config';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { course, category, lesson } = await req.json();
  
  // TODO: Make db pivot table uuid -> model so premium users can use gpt-3.5-turbo model
  // const model = 'deepseek/deepseek-chat-v3-0324:free';
  // const model = 'gpt-3.5-turbo';
  // const model = 'thudm/glm-z1-9b:free';
  try {
    const response = await axios.post(API_URL, {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an ${category} expert educator teaching about ${course}. Always respond in markdown format. Always respond in english or language of the course. Always wrap code blocks using talewindcss dasyUI mockup code component https://daisyui.com/components/mockup-code/#without-prefix, and fill free to use emojis as icons. Write lecture like you afr fun professor in front of the class and at the end encurage student to ask questions.`
        },
        {
          role: 'user',
          content: `Generate a lesson on ${lesson}.`
        }
      ]
    }, {
      headers: {
      // TODO: FIX ENV AND HIDE TOKEN BEFORE PUSH TO GITHUB
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json({ lesson: response.data.choices[0].message.content });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json({ error: 'Failed to generate lesson.' }, { status: 500 });
  }
}
