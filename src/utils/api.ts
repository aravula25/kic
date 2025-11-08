import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'sonner';

// Create Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001', // fallback to local
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use((req) => {
  const { setLoading } = useAppStore.getState();
  setLoading(true);

  const user = localStorage.getItem('user');
  if (user) {
    const token = JSON.parse(user)?.token;
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

// Response interceptor
API.interceptors.response.use(
  (res) => {
    useAppStore.getState().setLoading(false);
    return res;
  },
  (err) => {
    useAppStore.getState().setLoading(false);
    toast.error(err?.response?.data?.message || 'Something went wrong');
    return Promise.reject(err);
  }
);

export default API;
