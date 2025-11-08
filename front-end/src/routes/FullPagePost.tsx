import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyPosts } from '@/data/dummyPosts';
import { Post as BasePost } from '@/types/post';
import { useUserStore } from '@/store/useUserStore';

type Comment = {
  id: string;
  user: string;
  text: string;
  createdAt: string;
};

type PostWithComments = BasePost & {
  comments?: Comment[];
};

type Props = { post: PostWithComments; isLoggedIn: boolean };

// Dummy comments generator
const generateDummyComments = (start = 0, count = 20): Comment[] => {
  const users = ['Alice', 'Bob', 'Charlie', 'David', 'Emily', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jack'];
  const texts = [
    'Great post!', 'Thanks for sharing.', 'Amazing cleanup!', 'Keep it up!',
    'This is inspiring.', 'Nice work.', 'Wow, impressive!', 'Really helpful.',
    'Love this!', 'Fantastic effort.'
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: (start + i + 1).toString(),
    user: users[Math.floor(Math.random() * users.length)],
    text: texts[Math.floor(Math.random() * texts.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
  }));
};

function FullPagePostComponent({ post, isLoggedIn }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const commentContainerRef = useRef<HTMLDivElement>(null);

  const { user } = useUserStore();      // Get user from store
  isLoggedIn = !!user;            // true if user exists
  const navigate = useNavigate();

  useEffect(() => {
    const initialComments = post.comments?.length ? post.comments : generateDummyComments(0, 20);
    setComments(initialComments);
  }, [post]);

  const handleScroll = () => {
    if (!commentContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = commentContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      const nextComments = generateDummyComments(comments.length, 20);
      setComments((prev) => [...prev, ...nextComments]);
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !isLoggedIn) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: 'CurrentUser',
      text: newComment,
      createdAt: new Date().toISOString()
    };
    setComments([comment, ...comments]);
    setNewComment('');
    commentContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevImage = () => {
    if (post.imageUrl.length > 1) setCurrentImage((prev) => (prev - 1 + post.imageUrl.length) % post.imageUrl.length);
  };
  const nextImage = () => {
    if (post.imageUrl.length > 1) setCurrentImage((prev) => (prev + 1) % post.imageUrl.length);
  };

  const statusClasses = post.status === 'resolved'
    ? 'bg-green-500 text-white shadow-sm'
    : 'bg-yellow-400 text-gray-900 shadow-sm';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Post Section */}
      <div className="w-full md:w-7/12 flex-shrink-0 bg-white overflow-y-auto p-4 md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow-sm text-sm font-medium transition w-max"
        >
          ← Back
        </button>

        <div className="relative flex justify-center mb-4">
          {post.imageUrl.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transform -translate-y-1/2 transition"
            >
              ◀
            </button>
          )}
          <img
            src={post.imageUrl[currentImage]}
            alt="Post"
            className="object-contain w-full max-h-[70vh] rounded-lg shadow-lg transition-all duration-500"
          />
          {post.imageUrl.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transform -translate-y-1/2 transition"
            >
              ▶
            </button>
          )}
          {post.imageUrl.length > 1 && (
            <div className="absolute bottom-2 flex space-x-2">
              {post.imageUrl.map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentImage === index ? 'bg-white' : 'bg-gray-500'}`}
                />
              ))}
            </div>
          )}
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>

        <h2 className="text-2xl font-semibold mt-3">{post.description}</h2>
        <p className="text-gray-500 text-sm mt-1">
          Posted by {post.createdBy.name} at {new Date(post.createdAt).toLocaleString()}
        </p>
        <p className="text-gray-400 text-sm mt-1">Location: {post.location.name}</p>

        {isLoggedIn ? (
          <div className="flex gap-4 mt-4 text-gray-600">
            <button className="hover:text-green-600 transition font-medium">👍 Hype</button>
            <button className="hover:text-green-600 transition font-medium">💬 Comment</button>
            <button className="hover:text-red-600 transition font-medium">⚠️ Report</button>
          </div>
        ) : (
          <p className="text-gray-400 mt-4 text-sm">Login to interact with this post.</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="w-full md:w-5/12 flex flex-col bg-gray-50">
        <h3 className="text-xl font-semibold mb-4 px-4 md:px-0">Comments</h3>

        {/* Scrollable comments */}
        <div
          className="flex-1 overflow-y-auto px-4 md:px-0"
          ref={commentContainerRef}
          onScroll={handleScroll}
        >
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c.id}
                className="flex gap-3 border rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                    {c.user.charAt(0)}
                  </div>
                </div>
                {/* Comment content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-gray-800 font-medium">{c.user}</p>
                    <span className="text-gray-400 text-xs">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Comment input at bottom */}
        {isLoggedIn && (
          <div className="sticky bottom-0 bg-gray-50 z-10 p-4 md:p-3">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-full shadow-lg w-full">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm resize-none"
                placeholder="Add a comment..."
                rows={1}
              />
              <button
                onClick={handlePostComment}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition shadow"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <p className="text-gray-400 mt-2 px-4 md:px-0">Login to comment on this post.</p>
        )}
      </div>
    </div>
  );
}

// Wrapper component
type FullPagePostProps = {
  isLoggedIn: boolean;
};

export default function FullPagePost({ isLoggedIn }: FullPagePostProps) {
  const { id } = useParams<{ id: string }>();
  const post = dummyPosts.find((p) => p._id === id) as PostWithComments | undefined;

  if (!post) return <div className="p-6">Post not found</div>;

  return <FullPagePostComponent post={post} isLoggedIn={isLoggedIn} />;
}