import { useState } from 'react';
import API from '@/utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !description || !location) {
      toast.error('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('description', description);
    formData.append('location', location);

    try {
      await API.post('/posts', formData);
      toast.success('Post created successfully');
      navigate('/');
    } catch (err) {
      // handled by interceptor
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-green-600">
        Create New Post
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
