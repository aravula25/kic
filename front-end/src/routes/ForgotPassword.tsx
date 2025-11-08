import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '@/utils/api';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';

export default function ForgotPassword() {
  const { setLoading } = useAppStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: send code, 2: verify code, 3: set new password
  const [identifier, setIdentifier] = useState(''); // username/email
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLocalLoading] = useState(false);

  // Step 1: Send code
  const sendCode = async () => {
    if (!identifier) {
      toast.error('Please enter your username or email');
      return;
    }
    try {
      setLocalLoading(true);
      setLoading(true);
      await API.post('/auth/forgot-password', { identifier });
      toast.success('Verification code sent to your email');
      setStep(2);
    } catch (err) {
      // handled by interceptor
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const verifyCode = async () => {
    if (!code) {
      toast.error('Please enter the code sent to your email');
      return;
    }
    try {
      setLocalLoading(true);
      setLoading(true);
      await API.post('/auth/verify-code', { identifier, code });
      toast.success('Code verified! Set your new password.');
      setStep(3);
    } catch (err) {
      // handled by interceptor
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const setPasswordHandler = async () => {
    if (!newPassword) {
      toast.error('Please enter your new password');
      return;
    }
    try {
      setLocalLoading(true);
      setLoading(true);
      await API.post('/auth/reset-password', { identifier, code, newPassword });
      toast.success('Password updated! Please login.');
      navigate('/login');
    } catch (err) {
      // handled by interceptor
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Forgot Password</h2>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
            />
            <button
              onClick={sendCode}
              disabled={loading}
              className={`py-3 rounded-lg font-semibold text-white w-full transition-colors ${
                loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
            <p className="text-sm mt-2 text-center text-gray-500">
              Remembered password?{' '}
              <Link to="/login" className="text-green-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
            />
            <button
              onClick={verifyCode}
              disabled={loading}
              className={`py-3 rounded-lg font-semibold text-white w-full transition-colors ${
                loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="py-2 rounded-lg border border-gray-300 hover:bg-gray-100 mt-2 w-full"
            >
              Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
            />
            <button
              onClick={setPasswordHandler}
              disabled={loading}
              className={`py-3 rounded-lg font-semibold text-white w-full transition-colors ${
                loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
            <button
              onClick={() => setStep(2)}
              className="py-2 rounded-lg border border-gray-300 hover:bg-gray-100 mt-2 w-full"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
