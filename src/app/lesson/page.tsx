'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

// Define types for lesson and course data
interface Lesson {
  id: number;
  title: string;
  completed: boolean;
}

interface GeneratedLessonResponse {
  lesson: string;
}

export default function LessonPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const lessonId = searchParams.get('lessonId');
  const category = searchParams.get('category');

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [fetchingResponse, setFetchingResponse] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUserId(user?.id || null);
      }
    };

    fetchUser();
  }, []);

  // Fetch lesson data and verify access
  useEffect(() => {
    if (!courseId || !lessonId || !userId) return;

    const fetchLessonData = async () => {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('user_id, chapters!inner(lessons!inner(id, title, completed))')
          .eq('id', courseId)
          .single();

        if (courseError) throw new Error(courseError.message);

        if (courseData?.user_id !== userId) {
          setError('You do not have permission to view this lesson.');
          return;
        }

        const foundLesson = courseData.chapters
          .flatMap((chapter) => chapter.lessons)
          .find((lesson) => lesson.id === parseInt(lessonId as string));

        if (!foundLesson) {
          setError('Lesson not found');
          return;
        }

        setLesson(foundLesson);
      } catch (err) {
        console.error('Error fetching lesson data:', err);
        setError('An error occurred while fetching the lesson data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [courseId, lessonId, userId]);

  // Fetch generated lesson content on load
  useEffect(() => {
    if (!lesson) return;

    const fetchGeneratedLesson = async () => {
      setFetchingResponse(true);
      try {
        const res = await fetch('/api/generate-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course: courseId, category, lesson: lesson.title }),
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch lesson: ${res.statusText}`);
        }

        const data: GeneratedLessonResponse = await res.json();

        if (!data.lesson) {
          throw new Error('Lesson content not found in the response.');
        }

        setMessages([data.lesson]);
      } catch (err) {
        console.error('Error generating lesson:', err);
        setMessages(['Failed to load lesson content.']);
      } finally {
        setFetchingResponse(false);
      }
    };
    fetchGeneratedLesson();
  }, [lesson]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, `You: ${input}`]);
    const userMessage = input;
    setInput('');
    setFetchingResponse(true);

    try {
      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, data.answer]);
    } catch (err) {
      console.error('Error generating answer:', err);
      setMessages(prev => [...prev, 'Failed to fetch answer.']);
    } finally {
      setFetchingResponse(false);
    }
  };

  const markAsComplete = async () => {
    const { error } = await supabase
      .from('lessons')
      .update({ complete: true })
      .eq('id', lessonId);

    if (error) {
      console.error('Error marking lesson complete:', error);
      alert('Could not mark lesson as completed.');
    } else {
      alert('Lesson marked as completed!');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 mb-16 w-full">
      <h2 className="text-xl font-semibold mb-3">Welcome to your lesson!</h2>
      <h1 className="text-2xl font-bold mb-2">{lesson?.title}</h1>

      {messages.map((msg, index) => {
        if (typeof msg !== 'string') return null;
        const isUser = msg.startsWith('You: ');
        return (
          <div key={index} className={`chat ${isUser ? 'chat-end' : 'chat-start'} w-full`}>
            <div className={`chat-bubble ${isUser ? 'chat-bubble-warning' : 'chat-bubble-primary'}`}>
              <ReactMarkdown>{isUser ? msg.replace('You: ', '') : msg}</ReactMarkdown>
            </div>
          </div>
        );
      })}

      {fetchingResponse && (
        <div className="flex items-center justify-center">
          <div className="text-center">
            Lesson is generating...<span className="loading loading-infinity loading-xl"></span>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="flex space-x-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input px-3 py-2 flex-1"
          disabled={fetchingResponse}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={fetchingResponse}
        >
          Send
        </button>
      </form>

      <button
        onClick={markAsComplete}
        className="btn btn-success mt-4 px-4 py-2 w-full"
        disabled={fetchingResponse}
      >
        Mark lesson completed
      </button>
    </div>
  );
}

// Wrap the LessonPage in Suspense and export it as a named export
export const LessonPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LessonPage />
  </Suspense>
);
