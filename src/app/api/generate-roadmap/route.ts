import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { courseTitle, category } = await req.json();
  try {
  debugger
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',  // TODO: Put in some config as a param?
      messages: [
        {
          role: 'system',
          content: `You are an expert educator creating course roadmaps.`
        },
        {
          role: 'user',
          content: `Generate a learning roadmap for a course titled "${courseTitle}" in the "${category}" category. List lessons as bullet points.`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({ roadmap: response.data.choices[0].message.content });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap.' }, { status: 500 });
  }
}
