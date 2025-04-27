import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define the structure of the roadmap response
interface Lesson {
  chapter: string;
  lessons: string[];
}

export async function POST(req: NextRequest) {
  const { title, category } = await req.json();

  // TODO: Make db pivot table uuid -> model so premium users can use gpt-3.5-turbo model
  const model = 'deepseek/deepseek-chat-v3-0324:free';

  // Function to convert the response string to JSON
  function convertToJson(response: string): Lesson[] | null {
    // Remove the "```json" and "```" markers and clean up extra newlines
    const cleanResponse = response.replace(/```json|\n```/g, '').trim();

    // Convert the cleaned string to a valid JSON array
    try {
      const jsonResponse: Lesson[] = JSON.parse(cleanResponse);
      return jsonResponse;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert educator creating course roadmaps.`
        },
        {
          role: 'user',
          content: `Generate a learning roadmap for a course titled "${title}" in the "${category}" category. Just generate JSON, without any other text in the format: [{"chapter": "", "lessons": []}, {"chapter": "", "lessons": []}]`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({ roadmap: convertToJson(response.data.choices[0].message.content) });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap.' }, { status: 500 });
  }
}
