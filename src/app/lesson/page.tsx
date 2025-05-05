'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AlertMessage from '@/components/AlertMessage';
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
  const [showAlert, setShowAlert] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  
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
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    try {
      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, lecture: messages[0], course, category, lesson }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, data.answer]);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setShowAlert(true); 
    // alert('Lesson marked as completed!');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="px-4 mb-16 w-full pb-16">
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
      <div role="alert" className="alert mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className='text-lg'>This lecture was specially generated for you by your personal AI techer. He will guide you through every topic, explain anything you&apos;re unsure about, and answer your questions as you go. Think of it as your own personal tutor — always ready to break things down, offer examples, and help you master the material at your own pace.</span>
      </div>
      <div className="divider">LECTURE</div>
      {messages.map((msg, index) => {
        if (typeof msg !== 'string') return null;
        const isUser = msg.startsWith('You: ');
        return (
          <div key={index} className={`chat ${isUser ? 'chat-end' : 'chat-start'} w-full text-2xl`}>
            <div className={`chat-bubble ${isUser ? 'chat-bubble-warning' : 'chat-bubble-primary'} shadow-xl shadow-white-500 text-wrap`}>
              {/* <ReactMarkdown>{isUser ? msg.replace('You: ', '') : msg}</ReactMarkdown> */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold mt-6 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold mt-5 mb-2">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-semibold mt-4 mb-2">{children}</h4>
                ),
                h5: ({ children }) => (
                  <h5 className="text-lg font-semibold mt-3 mb-1">{children}</h5>
                ),
                h6: ({ children }) => (
                  <h6 className="text-base font-medium mt-3 mb-1">{children}</h6>
                ),
                p: ({ children }) => (
                  <p className="text-base leading-relaxed mb-4">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                del: ({ children }) => (
                  <del className="line-through text-error">{children}</del>
                ),
                  code({ children }) {
                    return (
                      <pre className="bg-base-200 p-2 rounded text-sm my-2 overflow-x-auto">
                        <code >{children}</code>
                      </pre>
                    );
                  },
                  hr() {
                    return (
                      <div className="divider my-2"></div>
                    );
                  },
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 rounded-box border border-base-content/5 bg-base-100">
                      <table className="table w-full">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="text-warning bg-base-300">{children}</thead>
                  ),
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => <tr className='hover:bg-base-300'>{children}</tr>,
                  th: ({ children }) => (
                    <th className="">{children}</th>
                  ),
                  td: ({ children }) => <td className="">{children}</td>,
                  ol: ({ children }) => (
                    <ol className="list list-inside my-4">{children}</ol>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside my-4">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1 text-base leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary-focus"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {isUser ? msg.replace('You: ', '') : msg}
              </ReactMarkdown>

            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
      {fetchingResponse && (
        <div className="flex items-center justify-center">
          <div className="text-center">
            Lesson is generating...<span className="loading loading-infinity loading-xl text-[#F7AD45]"></span>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-[rgba(34,40,49,0.75)] backdrop-blur p-4 flex flex-col space-y-3 shadow-xl z-50">
        <form onSubmit={handleSend} className="flex space-x-2">
          {/* <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="input px-3 py-2 flex-1"
            disabled={fetchingResponse}
          />
          <button
            type="submit"
            className="btn btn-soft btn-primary text-2xl"
            disabled={fetchingResponse}
          >
            ❓
          </button> */}


          <div className="join w-full">
            <div className="w-full">
              <label className="input validator join-item w-full">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="input px-3 py-2 flex-1 focus:outline-none"
                  disabled={fetchingResponse}
                />
              </label>
              <div className="validator-hint hidden">Ask a question...</div>
            </div>
            <button className="btn btn-primary join-item">SEND</button>
          </div>
        </form>

        <button
          onClick={markAsComplete}
          className="btn btn-outline  btn-success px-4 py-2 w-full"
          disabled={fetchingResponse}
        >
          MARK COMPLETED
        </button>

        {showAlert && (
          <AlertMessage
            variant="success"
            message="Course marked as completed!"
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
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
