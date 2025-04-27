import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const { title, categoryId, description, roadmap, userId } = await req.json();
  try {
    // 1. Insert course
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .insert([
        {
          title: title,
          category_id: categoryId,
          description: description,
          completed: false,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (courseError) throw courseError;

    // 2. Insert chapters and lessons
    for (const chapter of roadmap) {
      const { data: insertedChapter, error: chapterError } = await supabaseAdmin
        .from('chapters')
        .insert([
          {
            title: chapter.chapter,
            course_id: course.id,
          },
        ])
        .select()
        .single();

      if (chapterError) throw chapterError;

      for (const lessonTitle of chapter.lessons) {
        const { error: lessonError } = await supabaseAdmin.from('lessons').insert([
          {
            title: lessonTitle,
            completed: false,
            chapter_id: insertedChapter.id,
          },
        ]);

        if (lessonError) throw lessonError;
      }
    }

    return NextResponse.json({ message: 'Course created successfully!', course });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Supabase API error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'Failed to save course.' }, { status: 500 });
    }
  }
}
