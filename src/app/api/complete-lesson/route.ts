import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const { lessonId, userId } = await req.json();
  try {
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('lesson')
      .update([
        {
          completed: true,
          user_id: userId,
        },
      ])
      .eq('id', lessonId);

    if (lessonError) throw lessonError;

    return NextResponse.json({ message: 'lesson is completed successfully!', lesson });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Supabase API error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'Failed to complete lesson.' }, { status: 500 });
    }
  }
}
