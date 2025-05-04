'use client';

import Link from 'next/link';
import { FC } from 'react';
import VerifiedNewIcon from '@mui/icons-material/Verified';
import PlayCircleNewIcon from '@mui/icons-material/PlayCircle';
import CloseNewIcon from '@mui/icons-material/Close';

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

interface ChapterDialogProps {
  isOpen: boolean;
  chapter: Chapter;
  courseId?: number;
  onClose: () => void;
}

const ChapterDialog: FC<ChapterDialogProps> = ({ isOpen, chapter, courseId, onClose }) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-full">
      <div className="modal-box w-full sm:w-11/12 h-full sm:h-auto animate-fade-in pb-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <CloseNewIcon className="text-error text-4xl" />
        </button>

        <h3 className="font-bold text-3xl mb-6 mt-4">{chapter.title}</h3>

        <div className="space-y-6">
          <div>
            <ul className="steps w-full py-2">
              {chapter.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={`step font-bold ${lesson.completed ? 'step-success' : ''}`}
                />
              ))}
            </ul>
          </div>

          <ul className="space-y-4">
            {chapter.lessons.length > 0 ? (
              chapter.lessons.map((lesson, index) => (
                <li key={lesson.id} className="flex items-center gap-4">
                  <div className="text-3xl text-center font-thin opacity-30 tabular-nums w-10">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="text-xl font-medium text-left">{lesson.title}</div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      0 Notes!
                      <span className="badge badge-warning badge-outline badge-sm px-2 py-0">
                        Coming soon!
                      </span>
                    </div>
                  </div>

                  <Link
                    href={{
                      pathname: '/lesson',
                      query: {
                        courseId,
                        chapterId: chapter.id,
                        lessonId: lesson.id,
                        category: 'Programming',
                      },
                    }}
                    className="hover:scale-105 transition-transform"
                  >
                    {lesson.completed ? (
                      <VerifiedNewIcon className="text-success text-3xl" />
                    ) : (
                      <PlayCircleNewIcon className="text-warning text-3xl" />
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 italic">No lessons available in this chapter yet.</li>
            )}
          </ul>
        </div>
      </div>
    </dialog>
  );
};

export default ChapterDialog;
