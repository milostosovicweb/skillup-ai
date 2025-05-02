'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import categories from '@/data/categories.json';
import ProtectedPage from '@/components/ProtectedPage';
import { supabase } from '@/lib/supabaseClient';

export default function CreateCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapChapter[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  type RoadmapChapter = {
    chapter: string;
    lessons: string[];
  };

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
  }, []);

  const handleGenateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        setGenerating(true);
        const response = await axios.post('/api/generate-roadmap', {
        title,
        category
        });
        setGenerating(false);
        // setRoadmap(JSON.parse(response.data.roadmap))
        setRoadmap(response.data.roadmap)
        console.log(response.data.roadmap);

    } catch (error) {
      setGenerating(false);
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap.');
    }
  };
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        setSaving(true);
        const response = await axios.post('/api/create-course', {
        title,
        categoryId: 1,
        description,
        roadmap,
        userId: userId
        });
        setSaving(false);
        console.error('Saved course:', response);
        setSaved(true);

    } catch (error) {
      setSaving(false);
      console.error('Error saving course:', error);
      alert('Failed to save course.');
    }
  };


  return (
    <ProtectedPage>
      <div className="max-w-xl mx-auto m-8 border border-base-300 mb-2 shadow-lg bg-[#222831] p-4">
        <h1 className="text-3xl font-bold mb-6">{ saved ? 'Course is successfully created!' : 'Create New Course'}</h1>
        {!saved && <form onSubmit={handleGenateRoadmap} className="space-y-4">
          
          <div>
            <label className="block mb-1">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full px-4 py-2 focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="textarea w-full px-4 py-2 focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select w-full px-4 py-2 focus:outline-none focus:ring-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          { !saved && <button
            type="submit"
            className="btn btn-primary w-full text-white py-2"
          >
            {generating && <div className="flex items-center justify-center">
              <p className="text-center">
                <span className="loading loading-infinity loading-xl"></span>
              </p>
            </div>
            }
            {!generating && roadmap.length > 0 && 'Regenerate Roadmap'}
            {!generating && roadmap.length === 0 && 'Generate Roadmap'}
          </button>
          } 
        </form>}
        { saved && <p className="text-lg font-bold mb-6">{title}</p>}
        { saved && <p className="text-lg font-bold mb-6">{category}</p>}
        { saved && <p className="text-lg font-bold mb-6">{description}</p>}
        <div>
          {roadmap.length > 0 && <h2 className="text-xl font-bold mb-2 mt-6">Learning Roadmap:</h2>}
          <div className="join join-vertical w-full mb-6">
            {roadmap.map((item, index) => (
              <div key={index} className="collapse collapse-arrow join-item border border-base-300 bg-base-200">
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-lg font-medium">
                  {index + 1}. {item.chapter}
                </div>
                <div className="collapse-content">
                  <ul className="list-disc list-inside space-y-1">
                    {item.lessons.map((topic, topicIndex) => (
                      <li key={topicIndex}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        { !saved && roadmap.length > 0 && <button
          type="button"
          onClick={handleSaveCourse}
          className="btn btn-primary w-full text-white py-2 mb-12"
        >
          {saving && <div className="flex items-center justify-center">
            <p className="text-center">
              <span className="loading loading-dots loading-xl"></span>
            </p>
          </div>
          }
          {!saving && 'Save Course'}
        </button>
        }
      </div>
    </ProtectedPage>
  );
}
