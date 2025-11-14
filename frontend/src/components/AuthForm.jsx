import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Leaf, CheckCircle, AlertTriangle } from 'lucide-react';

function AuthForm({ mode }) {
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsLoading(true);

    if (isSignup && formData.password.length < 6) {
      showMessage('Password must be at least 6 characters long.', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignup 
      ? formData
      : { email: formData.email, password: formData.password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      console.log(response)
      if (isSignup) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        showMessage('Account created successfully! Redirecting to dashboard...', 'success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      showMessage(err.response?.data?.error || `${isSignup ? 'Signup' : 'Login'} failed.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
        
        {/* Left Panel - Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="flex items-center mb-10">
            <Leaf className="w-9 h-9 mr-2.5 text-[#4ADE80]" />
            <h1 className="text-2xl font-extrabold text-gray-900">
              Mood<span className="text-[#4ADE80]">Meal</span>
            </h1>
          </div>

          {message.text && (
            <div className={`p-4 mb-4 text-sm rounded-xl flex items-center ${
              message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' 
                ? <CheckCircle className="w-5 h-5 mr-3" /> 
                : <AlertTriangle className="w-5 h-5 mr-3" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {isSignup ? 'Sign Up' : 'Login'}
            </h2>

            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Alice Smith"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20 transition-all"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder='alicesmith@gmail.com'
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder='********'
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 text-base outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 mt-4 rounded-xl text-lg font-bold text-white bg-[#4ADE80] hover:bg-[#3BC96E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
            </button>

            <p className="mt-5 text-center text-sm text-gray-600">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a 
                href={isSignup ? '/login' : '/signup'} 
                className="font-bold text-gray-900 hover:text-[#4ADE80] transition-colors"
              >
                {isSignup ? 'Login' : 'Sign up'}
              </a>
            </p>
          </form>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:block relative overflow-hidden rounded-r-[2.5rem]">
          <img
            src="/food-bowl.jpg"
            alt="Fresh healthy food bowl"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2070&q=80";
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-12">
            <h2 className="text-6xl font-extrabold leading-tight text-white drop-shadow-lg mb-3">
              Cultivate a <span className="text-[#5FE88A]">happier</span><br />
              <span className="text-[#5FE88A]">you</span> through<br />
              food! 🌱
            </h2>
            <p className="text-xl font-semibold text-white drop-shadow-md mt-2">
              Track your meals, understand your mood ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
