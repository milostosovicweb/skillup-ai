'use client';

import Link from 'next/link';
import VerifiedNewIcon from '@mui/icons-material/Verified';
import PlayCircleNewIcon from '@mui/icons-material/PlayCircle';
import CloseNewIcon from '@mui/icons-material/Close';
import { FC } from 'react';

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
  courseId: number;
  onClose: () => void;
}

const ChapterDialog: FC<ChapterDialogProps> = ({ isOpen, chapter, courseId, onClose }) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-full z-99999">
      <div className="modal-box">
        <form method="dialog">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <CloseNewIcon style={{ color: '#AC3F32', fontSize: 24 }} />
          </button>
        </form>

        <h3 className="font-bold text-3xl">{chapter.title}</h3>

        <div className="py-4">
          <ul className="steps w-full py-2">
            {chapter.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`step font-bold ${lesson.completed ? 'step-success' : ''}`}
              />
            ))}
          </ul>

          <ul className="list">
            {chapter.lessons.map((lesson, index) => (
              <li key={lesson.id} className="list-row flex items-center gap-4 py-2">
                <div className="text-4xl text-center font-thin opacity-30 tabular-nums w-10">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="text-2xl">{lesson.title}</div>
                  <div className="text-sm opacity-50 mt-1">
                    0 Notes!{' '}
                    <span className="badge badge-warning badge-outline badge-sm mb-1 text-sm px-2 py-0">
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
                >
                  {lesson.completed ? (
                    <VerifiedNewIcon style={{ color: '#6BB187', fontSize: 36 }} />
                  ) : (
                    <PlayCircleNewIcon style={{ color: '#DBAE5A', fontSize: 36 }} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
};

export default ChapterDialog;
