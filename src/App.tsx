import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import CreatePost from '@/routes/CreatePost';
import Profile from '@/routes/Profile';
import Login from '@/routes/Login';
import Register from '@/routes/Register';
import Feed from '@/routes/Feed';
import ToasterProvider from '@/components/ToastProvider';
import ForgotPassword from './routes/ForgotPassword';
import FullPagePost from './routes/FullPagePost';
import { useUserStore } from './store/useUserStore';

export default function App() {
  const { user } = useUserStore();
  const isLoggedIn = !!user;

  return (
    <>
      <Navbar />
      <Loader />
      <ToasterProvider />

      <div className="min-h-[calc(100vh-60px)] bg-gray-50">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/post/:id" element={<FullPagePost isLoggedIn={isLoggedIn}/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
