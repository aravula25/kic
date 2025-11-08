import { useState } from 'react';
import PostCard from '@/components/PostCard';
import { dummyPosts } from '@/data/dummyPosts';
import { Post } from '@/types/post';
import { useUserStore } from '@/store/useUserStore';

export default function Feed() {
  const [posts] = useState<Post[]>(dummyPosts);
  const [filter, setFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const { user } = useUserStore();
  const isLoggedIn = !!user;
  const filteredPosts =
    filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Community Feed</h1>

        <div className="flex gap-2 bg-white shadow-sm rounded-lg p-1">
          {['all', 'unresolved', 'resolved'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-1 rounded-md text-sm font-medium transition ${
                filter === type
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((pos) => <PostCard key={pos._id} post={pos} isLoggedIn={isLoggedIn}/>)
        ) : (
          <p className="text-gray-500 text-center col-span-full mt-10">
            No posts found
          </p>
        )}
      </div>
    </div>
  );
}
