import { useUserStore } from '@/store/useUserStore';

export default function Profile() {
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-600">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <div className="flex flex-col items-center text-center">
        <img
          src={'https://via.placeholder.com/100'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-3"
        />
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
      </div>

      <div className="mt-5 text-center border-t pt-4 text-gray-500 text-sm">
        <p>Posts will appear here soon.</p>
      </div>
    </div>
  );
}
