'use client';

import { useState } from 'react';
import axios from 'axios';
import categories from '@/data/categories.json';

export default function CreateCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const response = await axios.post('/api/generate-roadmap', {
        courseTitle: title,
        category
        });
        console.log('Generated Roadmap:', response.data.roadmap);
        alert(`Roadmap:\n\n${response.data.roadmap}`);

    } catch (error) {
        console.error('Error generating roadmap:', error);
        alert('Failed to generate roadmap.');
    }
    };


  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}
