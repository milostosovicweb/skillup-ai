'use client';

import ProtectedPage from '@/components/ProtectedPage';
import ChapterDialog from '@/components/ChapterDialog';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import FolderOpenNewIcon from '@mui/icons-material/FolderOpen';
// import VerifiedNewIcon from '@mui/icons-material/Verified';
// import PlayCircleNewIcon from '@mui/icons-material/PlayCircle';
// import CloseNewIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// import PieChart from '@/components/PieChart';

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

function getCourseStats(course: Course) {
  let totalLessons = 0;
  let completedLessons = 0;

  course.chapters.forEach((chapter: Chapter) => {
    totalLessons += chapter.lessons.length;
    completedLessons += chapter.lessons.filter((lesson) => lesson.completed).length;
  });

  return { totalLessons, completedLessons };
}

function setProgressColors(totalLessons: number, completedLessons: number) {
  const progressPercentage = (completedLessons / totalLessons) * 100;
    if (progressPercentage <= 25) {
      return '';
    } else if (progressPercentage >= 25 && progressPercentage < 50) {
      return 'warning';
    } else if (progressPercentage >= 50 && progressPercentage < 100) {
      return 'info';
    } else {
      return 'success';
    }
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

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
    setIsClient(true); // Ensure we are client-side before rendering
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Fetch courses when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchCourses = async () => {
      try {
        console.log('Fetching courses for user ID:', userId);
        const { data, error } = await supabaseAdmin
          .from('courses')
          .select('*, chapters(*, lessons(*))')
          .eq('user_id', userId)
          .order('id', { ascending: true })
          .order('id', { foreignTable: 'chapters', ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        const sortedData = data.map((course) => ({
          ...course,
          chapters: course.chapters.map((chapter: Chapter) => ({
            ...chapter,
            lessons: chapter.lessons.sort((a: Lesson, b: Lesson) => a.id - b.id),
          })),
        }));

        console.log('Fetched data:', sortedData); // Debug
        setCourses(sortedData as Course[]);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  if (!isClient) {
    return null;
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center -translate-y-10">
          <span className="loading loading-ring loading-xl bg-[#F7AD45]"></span>
        </p>
      </div>
    );

  if (error) {
    return <div className="text-red-500">{`Error: ${error}`}</div>;
  }

  return (
    <ProtectedPage>
      <div className="flex flex-col items-center p-0">
        <h1 className="text-3xl text-center font-bold pl-2 pb-2 mb-6">📈 Dashboard</h1>
        {courses.length === 0 ? (
          <div role="alert" className="alert alert-vertical sm:alert-horizontal text-xl w-8/12">
            <svg style={{ height: '48px', width: '48px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <span>Welcome! It looks like you haven’t created any courses yet.<br/>To start learning and unlock your personal AI teacher and mentor, go ahead and create your first course. It only takes a moment!</span>
            </div>
            <button className="btn btn-sm btn-primary p-6 text-xl" onClick={() => router.push('/create-course')}>👉 Create new courses to get started</button>
          </div>
        ) : (<div className="sm:w-8/12 w-full pt-2">

        {Object.entries(dialogOpen).map(([chapterId, isOpen]) => {
          if (!isOpen) return null;
          const course = courses.find(c => c.chapters.some(ch => ch.id === parseInt(chapterId)));
          const chapter = course?.chapters.find(ch => ch.id === parseInt(chapterId));
          if (!chapter) return null;

          return (
            <ChapterDialog
              key={chapterId}
              isOpen={isOpen}
              chapter={chapter}
              courseId={course?.id}
              onClose={() =>
                setDialogOpen((prev) => ({ ...prev, [chapterId]: false }))
              }
            />
          );
        })}

            <div className=' border border-base-300 mb-2 shadow-lg bg-[#222831] p-4'>
              <label className="input w-full">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input type="search" className="grow" placeholder="Search courses by title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              </label>
            </div>
              {/* <PieChart /> */}
            {filteredCourses.map((course) => {
              const { totalLessons, completedLessons } = getCourseStats(course);
              const progressColor = setProgressColors(totalLessons, completedLessons);
              return (
                <div key={course.id} className="collapse collapse-arrow border border-base-300 mb-2 shadow-lg bg-[#222831] p-4">
                  <input type="radio" name="my-accordion-2" />
                  <div className="collapse-title font-semibold text-2xl">
                    {course.title}
                    <progress
                      className={`progress progress-${progressColor} w-full`}
                      value={(completedLessons / totalLessons) * 100}
                      max="100"
                    ></progress>
                  </div>
                  <div className="collapse-content">
                    <div className="overflow-x-auto">
                      <p className="text-lg font-semibold">{course.description}</p>
                      <div className="divider"></div>
                      {/* <table className="table table-pin-rows table-pin-cols"> */}
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-center xs-hide w-10">#</th>
                            <th className="text-center xs-hide">CHAPTER</th>
                            <th className="text-center xs-hide w-20">LESSONS</th>
                            <th className="text-center xs-hide w-20">OPEN</th>
                            <th className="text-center hidden">OPEN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.chapters.map((chapter, index) => {
                            const completedCount = chapter.lessons.filter(
                              (lesson) => lesson.completed === true
                            ).length;
                            const lessonProgressColor = setProgressColors(chapter.lessons.length, completedCount);
                            return (
                              <tr key={chapter.id} className="hover:bg-base-300">
                                <th className="text-center text-xl">
                                {index + 1}
                                {/* <ChapterDialog
                                  isOpen={dialogOpen[chapter.id]}
                                  chapter={chapter}
                                  courseId={course.id}
                                  onClose={() => setDialogOpen((prev) => ({ ...prev, [chapter.id]: false }))}
                                /> */}
                                  {/*{dialogOpen[chapter.id] && (
                                    <dialog open className="modal" style={{ zIndex: 9999 }}>
                                      <div className="modal-box">
                                        <form method="dialog">
                                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                            <CloseNewIcon style={{ color: '#AC3F32', fontSize: 24 }}/>
                                          </button>
                                        </form>
                                        <h3 className="font-bold text-3xl">{chapter.title}</h3>
                                        <div className="py-4">
                                        <ul className="steps w-full py-2">
                                        {chapter.lessons.map((lesson, index) => ((
                                          <li key={index} className={`step font-bold ${lesson.completed ? 'step-success' : ''}`}></li>
                                        )))}
                                          </ul>
                                          <ul className="list">
                                            {chapter.lessons.map((lesson, index) => (
                                              <li key={index} className="list-row">
                                                <div className="text-4xl text-center font-thin opacity-30 tabular-nums">
                                                  {index + 1}
                                                </div>
                                                <div className="list-col-grow">
                                                  <div className='text-2xl'>{lesson.title}</div>
                                                  0 Notes! <span className="badge badge-warning badge-outline badge-sm mb-1 text-sm px-2 py-0">soon</span>
                                                </div>
                                                <Link
                                                  href={{
                                                    pathname: '/lesson',
                                                    query: {
                                                      courseId: course.id,
                                                      chapterId: chapter.id,
                                                      lessonId: lesson.id,
                                                      category: 'Programming',
                                                    },
                                                  }}
                                                >
                                                  {lesson.completed ? <VerifiedNewIcon style={{ color: '#6BB187', fontSize: 36 }}/> : <PlayCircleNewIcon style={{ color: '#DBAE5A', fontSize: 36 }}/>}  
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </dialog>
                                  )} */}
                                </th>
                                <td className='xs-hide text-xl'>
                                  {chapter.title}
                                  <progress
                                    className={`progress progress-${lessonProgressColor} w-full text-center`}
                                    value={completedCount}
                                    max={chapter.lessons.length}
                                  ></progress>
                                </td>
                                <td className="xs-hide text-center">
                                  {completedCount} of {chapter.lessons.length}
                                </td>
                                <td className='xs-hide'>
                                  <button
                                    className="btn btn-ghost text-center w-full"
                                    onClick={() =>
                                      setDialogOpen((prev) => ({
                                        ...prev,
                                        [chapter.id]: !prev[chapter.id],
                                      }))}
                                  >
                                    <FolderOpenNewIcon style={{ fontSize: 24 }} />
                                  </button>
                                {/* <ChapterDialog
                                  isOpen={dialogOpen[chapter.id]}
                                  chapter={chapter}
                                  courseId={course.id}
                                  onClose={() => setDialogOpen((prev) => ({ ...prev, [chapter.id]: false }))}
                                /> */}
                                  {/* {dialogOpen[chapter.id] && (
                                    <dialog open className="modal">
                                      <div className="modal-box">
                                        <form method="dialog">
                                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                            <CloseNewIcon style={{ color: '#AC3F32', fontSize: 24 }}/>
                                          </button>
                                        </form>
                                        <h3 className="font-bold text-3xl">{chapter.title}</h3>
                                        <div className="py-4">
                                        <ul className="steps w-full py-2">
                                        {chapter.lessons.map((lesson, index) => ((
                                          <li key={index} className={`step font-bold ${lesson.completed ? 'step-success' : ''}`}></li>
                                        )))}
                                          </ul>
                                          <ul className="list">
                                            {chapter.lessons.map((lesson, index) => (
                                              <li key={index} className="list-row">
                                                <div className="text-4xl text-center font-thin opacity-30 tabular-nums">
                                                  {index + 1}
                                                </div>
                                                <div className="list-col-grow">
                                                  <div className='text-2xl'>{lesson.title}</div>
                                                  0 Notes! <span className="badge badge-warning badge-outline badge-sm mb-1 text-sm px-2 py-0">soon</span>
                                                </div>
                                                <Link
                                                  href={{
                                                    pathname: '/lesson',
                                                    query: {
                                                      courseId: course.id,
                                                      chapterId: chapter.id,
                                                      lessonId: lesson.id,
                                                      category: 'Programming',
                                                    },
                                                  }}
                                                >
                                                  {lesson.completed ? <VerifiedNewIcon style={{ color: '#6BB187', fontSize: 36 }}/> : <PlayCircleNewIcon style={{ color: '#DBAE5A', fontSize: 36 }}/>}  
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </dialog>
                                  )} */}
                                </td>
                                <td className=' xs-show hidden px-0 py-1'>
                                  <button
                                    className={`btn btn-${lessonProgressColor} text-center w-full h-full py-2`}
                                    onClick={() =>
                                      setDialogOpen((prev) => ({
                                        ...prev,
                                        [chapter.id]: !prev[chapter.id],
                                      }))}
                                  >
                                  {chapter.title}<br />{completedCount} of {chapter.lessons.length}
                                  </button>
                                  {/* <progress
                                    className={`progress ${progressColor} w-full text-center`}
                                    value={completedCount}
                                    max={chapter.lessons.length}
                                  ></progress> */}
                                  {/* {dialogOpen[chapter.id] && (
                                    <dialog open className="modal">
                                      <div className="modal-box">
                                        <form method="dialog">
                                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                            <CloseNewIcon style={{ color: '#AC3F32', fontSize: 24 }}/>
                                          </button>
                                        </form>
                                        <h3 className="font-bold text-3xl">{chapter.title}</h3>
                                        <div className="py-4">
                                        <ul className="steps w-full py-2">
                                        {chapter.lessons.map((lesson, index) => ((
                                          <li key={index} className={`step font-bold ${lesson.completed ? 'step-success' : ''}`}></li>
                                        )))}
                                          </ul>
                                          <ul className="list">
                                            {chapter.lessons.map((lesson, index) => (
                                              <li key={index} className="list-row">
                                                <div className="text-4xl text-center font-thin opacity-30 tabular-nums">
                                                  {index + 1}
                                                </div>
                                                <div className="list-col-grow">
                                                  <div className='text-2xl'>{lesson.title}</div>
                                                  0 Notes! <span className="badge badge-warning badge-outline badge-sm mb-1 text-sm px-2 py-0">soon</span>
                                                </div>
                                                <Link
                                                  href={{
                                                    pathname: '/lesson',
                                                    query: {
                                                      courseId: course.id,
                                                      chapterId: chapter.id,
                                                      lessonId: lesson.id,
                                                      category: 'Programming',
                                                    },
                                                  }}
                                                >
                                                  {lesson.completed ? <VerifiedNewIcon style={{ color: '#6BB187', fontSize: 36 }}/> : <PlayCircleNewIcon style={{ color: '#DBAE5A', fontSize: 36 }}/>}  
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </dialog>
                                  )} */}
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