import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Leaf, CheckCircle, AlertTriangle } from 'lucide-react';

function AuthForm({ mode }) {
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const API_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

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

  const passwordError = isSignup && formData.password.length > 0 && formData.password.length < 6 
    ? 'Password must be at least 6 characters long.' 
    : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
        
        {/* Left Panel */}
        <div className="lg:w-[55%] p-8 lg:p-[32px] flex flex-col justify-center bg-white">
          <div className="flex items-center mb-8">
            <Leaf className="w-9 h-9 mr-2.5 text-[#22C55E]" />
            <h1 className="text-2xl font-semibold text-[#111827]">
              Mood<span className="text-[#22C55E]">Meal</span>
            </h1>
          </div>

          {message.text && (
            <div className={`p-4 mb-6 text-sm rounded-xl flex items-center ${
              message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' 
                ? <CheckCircle className="w-5 h-5 mr-3 shrink-0" /> 
                : <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {isSignup ? 'Sign Up' : 'Login'}
            </h2>

            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  autoComplete="name"
                  className="w-full h-12 px-[14px] bg-white border border-[#E5E7EB] rounded-xl text-gray-900 text-base placeholder-[#9CA3AF] outline-none focus:border-[#22C55E] focus:ring-[3px] focus:ring-[#22C55E]/20 transition-all"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="alicesmith@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full h-12 px-[14px] bg-white border border-[#E5E7EB] rounded-xl text-gray-900 text-base placeholder-[#9CA3AF] outline-none focus:border-[#22C55E] focus:ring-[3px] focus:ring-[#22C55E]/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className={`w-full h-12 px-[14px] bg-white border rounded-xl text-gray-900 text-base placeholder-[#9CA3AF] outline-none focus:ring-[3px] transition-all ${
                  passwordError 
                  ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' 
                  : 'border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E]/20'
                }`}
              />
              {passwordError && (
                <p className="mt-1 text-[12px] text-[#DC2626]">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !!passwordError}
              className="w-full h-[44px] flex justify-center items-center mt-6 rounded-xl text-lg font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] shadow-[0_4px_12px_rgba(34,197,94,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isSignup ? 'Sign Up' : 'Login'
              )}
            </button>

            <p className="mt-[20px] text-center text-sm text-gray-600">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a 
                href={isSignup ? '/login' : '/signup'} 
                className="font-medium text-[#2563EB] hover:underline transition-colors"
              >
                {isSignup ? 'Login' : 'Sign up'}
              </a>
            </p>
          </form>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-gray-900">
          <img
            src="/food-bowl.jpg"
            alt="Fresh healthy food bowl"
            className="absolute inset-0 w-full h-full object-cover brightness-90"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2070&q=80";
            }}
          />
          
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-black/35"></div>

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-12 z-10">
            <h2 className="text-[36px] md:text-[40px] leading-[1.2] font-extrabold text-[#FFFFFF] mb-3">
              Cultivate a <span className="text-[#22C55E]">happier</span> you<br />
              through food
            </h2>
            <p className="text-xl font-semibold text-white/85 mt-2">
              Track your meals, understand your mood
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
