import { useState } from 'react';
import API from '@/utils/api';
import { toast } from 'sonner';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier) {
      toast.error('Please enter your username/email');
      return;
    }
    else if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      // const { data } = await API.post('/auth/login', { identifier, password });
      const data = {
        user: {
          _id: '1',
          name: identifier,
          email: identifier,
          token: "Token",
          avatar: "string"
        }
      }
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-green-600 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-3 rounded-lg font-semibold text-white w-full transition-colors ${
              loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-500">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
