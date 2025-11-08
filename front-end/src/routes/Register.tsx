import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '@/utils/api';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';

export default function Register() {
  const { setLoading } = useAppStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 4 steps
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [picLoading, setPicLoading] = useState(false);

  useEffect(() => {
    if (!profilePic) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePic);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePic]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setProfilePic(e.target.files[0]);
  };

  const nextStep = () => {
    // Step validations
    if (step === 1 && (!form.firstName || !form.lastName)) {
      if (!form.firstName) toast.error('Please enter your first name');
      else toast.error('Please enter your last name');
      return;
    }
    if (step === 2 && (!form.username || !form.gender || !form.dob)) {
      if (!form.username) toast.error('Please enter your username');
      else if (!form.gender) toast.error('Please select gender');
      else toast.error('Please enter date of birth');
      return;
    }
    if (step === 3 && (!form.mobile || !form.email || !form.password)) {
      if (!form.mobile) toast.error('Please enter mobile number');
      else if (!form.email) toast.error('Please enter email');
      else toast.error('Please enter password');
      return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value as string));
      if (profilePic) {
        setPicLoading(true);
        data.append('profilePic', profilePic);
      }

      await API.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      // handled by interceptor
    } finally {
      setPicLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">

        {/* Left: Profile Picture (step 4 only) */}
        {step === 4 && (
          <div className="md:w-1/3 bg-green-600 flex flex-col items-center justify-center p-6">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={preview || 'https://via.placeholder.com/128?text=Avatar'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {picLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <label className="cursor-pointer text-white font-medium hover:underline">
              Upload Now
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </label>
            <p className="text-gray-100 text-sm mt-2 text-center">
              You can also upload later
            </p>
          </div>
        )}

        {/* Right: Form */}
        <div
          className={`p-8 flex flex-col justify-center w-full ${
            step !== 4 ? 'items-center' : 'md:w-2/3'
          }`}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="w-full">
            {/* Step 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
                />
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
                />
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full md:col-span-2"
                />
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full md:col-span-2"
                />
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <p className="text-gray-700 text-center font-medium">
                Upload your profile image (optional)
              </p>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 max-w-lg mx-auto w-full">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Previous
                </button>
              )}
              {step < 4 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Next
                </button>
              )}
              {step === 4 && (
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Register
                </button>
              )}
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
