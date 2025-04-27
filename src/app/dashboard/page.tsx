'use client';

import ProtectedPage from '@/components/ProtectedPage';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect, useRef } from 'react';
import FolderOpenNewIcon from '@mui/icons-material/FolderOpen';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  completed: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
}

function getCourseStats(course: { chapters: any[]; }) {
  // Initialize counters
  let totalLessons = 0;
  let completedLessons = 0;

  // Loop through chapters and their lessons
  course.chapters.forEach(chapter => {
    totalLessons += chapter.lessons.length;
    completedLessons += chapter.lessons.filter((lesson: { completed: any; }) => lesson.completed).length;
  });

  return {
    totalLessons,
    completedLessons
  };
}

function setProgressColors(totalLessons: number, completedLessons: number) {
  const progressPercentage = (completedLessons / totalLessons) * 100;
  if(progressPercentage <= 25){
    return ''
  }else if(progressPercentage > 25 && progressPercentage < 50){
    return 'progress-error'
  }else if(progressPercentage >= 50 && progressPercentage < 75){
    return 'progress-warning'
  }else if(progressPercentage >= 75 && progressPercentage < 100){
    return 'progress-info'
  }else{
    return 'progress-success'}
  }

export async function getCoursesWithChaptersAndLessons(userId: string): Promise<Course[]> {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('*, chapters(*, lessons(*))')
    .eq('user_id', userId)
    .order('id', { ascending: true })
    .order('id', { foreignTable: 'chapters', ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const sortedData = data.map(course => ({
    ...course,
    chapters: course.chapters.map(chapter => ({
      ...chapter,
      lessons: chapter.lessons.sort((a, b) => a.id - b.id)
    }))
  }));

  console.log('Fetched data:', sortedData);  // Debug: Ensure the data is coming back as expected
  return sortedData as Course[];
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Track if the page is client-side
  const dialogRefs = useRef<{ [key: string]: HTMLDialogElement | null }>({});

  // Get the logged-in user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user:', error);
      } else {
        setUserId(user?.id || null);
      }
    };
    getUser();
    setIsClient(true);  // Ensure we are client-side before rendering
  }, []);

  // Fetch courses when userId is available
  useEffect(() => {
    if (!userId) return; // wait until we have a userId

    const fetchCourses = async () => {
      try {
        console.log('Fetching courses for user ID:', userId);  // Debug: Ensure userId is correct
        const coursesData = await getCoursesWithChaptersAndLessons(userId);
        console.log('Courses data:', coursesData);  // Debug: Check the data fetched

        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);  // Debug: Error in fetching
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]); // depend on userId here

  if (!isClient) {
    return null;  // Prevent SSR mismatch by ensuring the page only renders on the client
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <p className="text-center -translate-y-10">
      <span className="loading loading-ring loading-xl bg-[#F7AD45]"></span>
    </p>
  </div>;

  if (error) {
    return <div className="text-red-500">{`Error: ${error}`}</div>;
  }

  // Debug: Check the state before rendering
  console.log('Courses state before rendering:', courses);

  return (
    <ProtectedPage>
      <div className="p-8">
        <h1 className="text-3xl font-bold pl-6 pb-2">Welcome to your Dashboard!</h1>

        <div className="stats shadow">{/* Stats component can go here */}</div>

        <h2 className="text-2xl font-bold pl-6 pb-2">Courses</h2>
        
        {/* Debug rendering to check data */}
        {courses.length === 0 ? (
          <div>No courses found</div>
        ) : (
          <div>
            {courses.map((course) => {
              // Get stats for each course
              const { totalLessons, completedLessons } = getCourseStats(course);
              const progressColor = setProgressColors(totalLessons, completedLessons)
              console.log('Progress color:', progressColor);
              return (
                <div key={course.id} className="collapse collapse-arrow bg-base-100 border border-base-300">
                  <input type="radio" name="my-accordion-2" />
                  <div className="collapse-title font-semibold">
                    {course.title}
                    <progress
                      className={`progress ${progressColor} w-full`}
                      value={(completedLessons / totalLessons) * 100}
                      max="100"
                    ></progress>
                  </div>
                  <div className="collapse-content">
                    <div className="overflow-x-auto">
                    <p className="text-lg font-semibold">{course.description}</p>
                    <div className="divider"></div>
                      <table className="table table-pin-rows table-pin-cols">
                        <thead>
                          <tr>
                            <th className="w-5 text-center">#</th>
                            <th className=" text-center">CHAPTER</th>
                            <th className="w-30 text-center">LESSONS</th>
                            <th className="w-20 text-center">OPEN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.chapters.map((chapter, index) => {
                            const completedCount = chapter.lessons.filter(
                              (lesson) => lesson.completed === true
                            ).length;
                            const progressColor = setProgressColors(chapter.lessons.length, completedCount)
                            return (
                              <tr key={chapter.id} className="hover:bg-base-300">
                                <th className='text-center text-xl'>{index + 1}</th>
                                <td>
                                  {chapter.title}
                                  <progress
                                    className={`progress ${progressColor} w-full text-center`}
                                    value={completedCount}
                                    max={chapter.lessons.length}
                                  ></progress>
                                </td>
                                <td className='text-center'>
                                  {completedCount} of {chapter.lessons.length}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-ghost text-center"
                                    onClick={() => dialogRefs.current[chapter.id]?.showModal()}
                                  >
                                    <FolderOpenNewIcon style={{ color: '', fontSize: 24 }} />
                                  </button>
                                  <dialog
                                    ref={(el) => (dialogRefs.current[chapter.id] = el)}
                                    className="modal"
                                  >
                                    <div className="modal-box">
                                      <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                          ✕
                                        </button>
                                      </form>
                                      <h3 className="font-bold text-lg">{chapter.title}</h3>
                                      <p className="py-4">
                                        <ul className="list bg-base-100 rounded-box shadow-md">
                                          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                                            Lessons
                                          </li>
                                          {chapter.lessons.map((lesson, index) => {
                                            return (
                                              <li key={index} className="list-row">
                                                <div className="text-4xl font-thin opacity-30 tabular-nums">
                                                  {index + 1}
                                                </div>
                                                <div className="list-col-grow">
                                                  <div>{lesson.title}</div>
                                                  <div className="text-xs uppercase font-semibold opacity-60">
                                                    <div
                                                      className={`badge badge-xs ${
                                                        lesson.completed
                                                          ? 'badge-success'
                                                          : 'badge-secondary'
                                                      }`}
                                                    >
                                                      {lesson.completed
                                                        ? 'Completed'
                                                        : 'Not Completed'}
                                                    </div>
                                                  </div>
                                                </div>
                                                {/* <button className="btn btn-square btn-ghost"> */}
                                                
                                                <Link
                                                  href={{
                                                    pathname: '/lesson',
                                                    query: {
                                                      courseId: course.id,
                                                      chapterId: chapter.id,
                                                      lessonId: lesson.id,
                                                      category: 'Programming', // Example category
                                                    },
                                                  }}
                                                >
                                                  <svg
                                                    className="size-[1.2em]"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <g
                                                      strokeLinejoin="round"
                                                      strokeLinecap="round"
                                                      strokeWidth="2"
                                                      fill="none"
                                                      stroke="currentColor"
                                                    >
                                                      <path d="M6 3L20 12 6 21 6 3z"></path>
                                                    </g>
                                                  </svg>
                                                  </Link>
                                                {/* </button> */}
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </p>
                                    </div>
                                  </dialog>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
