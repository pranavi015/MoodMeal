import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, Utensils, Heart, Sparkles } from 'lucide-react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-[#4ADE80]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center">
            <Leaf className="w-10 h-10 mr-3 text-[#4ADE80]" />
            <h1 className="text-3xl font-extrabold text-gray-800">
              Mood<span className="text-[#4ADE80]">Meal</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border-2 border-[#4ADE80]">
              <User className="w-5 h-5 text-[#4ADE80]" />
              <span className="text-gray-800 font-bold">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-[#4ADE80]">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            Welcome back, {user.name}! 🎉
          </h2>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Meals Card */}
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Utensils className="w-12 h-12 text-white" />
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-bold text-sm">NEW</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Meals Tracked</h3>
            <p className="text-6xl font-extrabold text-white">0</p>
          </div>

          {/* Mood Logs Card */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-12 h-12 text-white" />
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-bold text-sm">TRACK</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Mood Logs</h3>
            <p className="text-6xl font-extrabold text-white">0</p>
          </div>

          {/* Healthy Swaps Card */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-8 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-12 h-12 text-white" />
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-bold text-sm">SMART</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Healthy Swaps</h3>
            <p className="text-6xl font-extrabold text-white">0</p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl shadow-xl p-10 border-4 border-orange-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-500 p-4 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-800">Coming Soon! 🚀</h3>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Your full dashboard with meal tracking, mood insights, and personalized recommendations 
            is under development. Get ready for an amazing experience that will help you cultivate 
            a happier, healthier you through mindful eating! ✨
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;