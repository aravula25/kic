import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Post = {
  _id: string;
  imageUrl: string[];
  description: string;
  location: { name: string };
  status: 'resolved' | 'unresolved';
  createdBy: { name: string };
  createdAt: string;
};

type Props = { post: Post; isLoggedIn: boolean };

export default function PostCard({ post, isLoggedIn }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const nextImage = () => {
    if (post.imageUrl.length > 1) {
      setCurrentImage((prev) => (prev + 1) % post.imageUrl.length);
    }
  };

  const handleImageClick = () => {
    // Navigate to full page post view
    navigate(`/post/${post._id}`);
  };

  const statusClasses =
    post.status === 'resolved'
      ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
      : 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-900 shadow-lg';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Image with stylish status tag */}
      <div className="relative cursor-pointer" onClick={handleImageClick}>
        <img
          src={post.imageUrl[currentImage]}
          alt="Post"
          className="w-full h-64 object-cover"
        />
        <span
          className={`absolute top-3 left-3 px-4 py-1 rounded-full text-sm font-semibold ${statusClasses} transition-transform transform hover:scale-105`}
        >
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      </div>

      {/* Description */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-gray-700">{post.description}</p>
        <p className="text-gray-400 text-sm">
          Posted by {post.createdBy.name} at {new Date(post.createdAt).toLocaleString()}
        </p>

        {/* Actions (visible only if logged in) */}
        {isLoggedIn && (
          <div className="mt-auto flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-4">
              <button className="hover:text-green-600 transition-colors">👍 Hype</button>
              <button className="hover:text-green-600 transition-colors">💬 Comment</button>
            </div>
            <button className="hover:text-red-600 transition-colors">⚠️ Report</button>
          </div>
        )}
      </div>
    </div>
  );
}
