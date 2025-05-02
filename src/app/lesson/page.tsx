'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
// import Image from 'next/image';

// Define types for lesson and course data
// interface Lesson {
//   id: number;
//   title: string;
//   completed: boolean;
// }

interface GeneratedLessonResponse {
  lesson: string;
}

function LessonPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const lessonId = searchParams.get('lessonId');
  const category = searchParams.get('category');

  const [course, setCourses] = useState<Lesson | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [fetchingResponse, setFetchingResponse] = useState(false);

  
  interface Chapter {
    id: number;
    title: string;
    lessons: Lesson[];
  }
  interface Lesson {
    id: number;
    title: string;
    completed: boolean;
  }

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
          .select('*, chapters!inner(lessons!inner(id, title, completed))')
          .eq('id', courseId)
          .single();

        if (courseError) throw new Error(courseError.message);

        if (courseData?.user_id !== userId) {
          setError('You do not have permission to view this lesson.');
          return;
        }

        console.log('Found data:', courseData);
        setCourses(courseData);
        const foundLesson = courseData.chapters
          .flatMap((chapter: Chapter) => chapter.lessons)
          .find((lesson: Lesson) => lesson.id === parseInt(lessonId as string));

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
      .update({ completed: true })
      .eq('id', lessonId);

    if (error) {
    debugger
      console.error('Error marking lesson complete:', error);
      alert('Could not mark lesson as completed.');
    } else {
      alert('Lesson marked as completed!');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="px-4 mb-16 w-full">
      {/* <h2 className="text-xl font-semibold mb-3">Welcome to your lesson!</h2> */}
      {/* <h1 className="text-2xl font-bold mb-2">{lesson?.title}</h1> */}

      <div className="flex max-w-sm items-center gap-x-4 pb-4 ml-1">
        {/* <Image 
        className="size-12 shrink-0" 
        src="/images/chat.svg" 
        width="48" height="48" alt="ChitChat Logo" /> */}
        <svg className="size-12 shrink-0" viewBox="0 0 40 40"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a"><stop stop-color="#2397B3" offset="0%"></stop><stop stop-color="#13577E" offset="100%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="b"><stop stop-color="#73DFF2" offset="0%"></stop><stop stop-color="#47B1EB" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M28.872 22.096c.084.622.128 1.258.128 1.904 0 7.732-6.268 14-14 14-2.176 0-4.236-.496-6.073-1.382l-6.022 2.007c-1.564.521-3.051-.966-2.53-2.53l2.007-6.022A13.944 13.944 0 0 1 1 24c0-7.331 5.635-13.346 12.81-13.95A9.967 9.967 0 0 0 13 14c0 5.523 4.477 10 10 10a9.955 9.955 0 0 0 5.872-1.904z" fill="url(#a)" transform="translate(1 1)"></path><path d="M35.618 20.073l2.007 6.022c.521 1.564-.966 3.051-2.53 2.53l-6.022-2.007A13.944 13.944 0 0 1 23 28c-7.732 0-14-6.268-14-14S15.268 0 23 0s14 6.268 14 14c0 2.176-.496 4.236-1.382 6.073z" fill="url(#b)" transform="translate(1 1)"></path><path d="M18 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM24 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM30 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#FFF"></path></g></svg>
        <div>
          <div className="text-2xl font-medium text-black dark:text-white">{course?.title}</div>
          <p className="text-xl text-gray-500 dark:text-gray-400">{lesson?.title}</p>
        </div>
      </div>

      {messages.map((msg, index) => {
        if (typeof msg !== 'string') return null;
        const isUser = msg.startsWith('You: ');
        return (
          <div key={index} className={`chat ${isUser ? 'chat-end' : 'chat-start'} w-full text-2xl`}>
            <div className={`chat-bubble ${isUser ? 'chat-bubble-warning' : 'chat-bubble-primary'} shadow-xl shadow-white-500`}>
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

// Default export the Suspense wrapper
export default function LessonPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LessonPage />
    </Suspense>
  );
}
