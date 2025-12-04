import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Heart, Sparkles, Plus } from 'lucide-react';
import Layout from '../components/Layout';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    mealsTracked: null,
    moodLogs: null,
    healthySwaps: null
  });
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-4 border-[#4ADE80]">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome back, {user.name}! 🎉
          </h2>
          {/* <p className="text-gray-600 text-lg">
            <span className="font-semibold">Email:</span> {user.email}
          </p> */}
        </div>

        {/* Quick Action Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/meals')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#4ADE80] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#3BC96E] transform hover:scale-105 transition-all"
          >
            <Plus className="w-6 h-6" />
            Log a Meal
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Meals Card */}
          <div
            onClick={() => navigate('/meals')}
            className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-3xl shadow-xl cursor-pointer transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Utensils className="w-12 h-12 text-white" />
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-bold text-sm">NEW</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Meals Tracked</h3>
            <p className="text-6xl font-extrabold text-white">{stats.mealsTracked}</p>
            <button className="mt-4 text-white underline font-semibold hover:text-green-100">
              View All Meals →
            </button>
          </div>

          {/* Mood Logs Card */}
          <div
            onClick={() => navigate('/insights')}
            className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-3xl shadow-xl cursor-pointer transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-12 h-12 text-white" />
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-bold text-sm">TRACK</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Mood Logs</h3>
            <p className="text-6xl font-extrabold text-white">{stats.moodLogs}</p>
            <button className="mt-4 text-white underline font-semibold hover:text-blue-100">
              View Insights →
            </button>
          </div>

          {/* Healthy Swaps Card */}
          <div
            onClick={() => navigate('/swaps')}
            className="bg-gradient-to-br from-purple-400 to-purple-600 p-8 rounded-3xl shadow-xl cursor-pointer transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-12 h-12 text-white" />
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-bold text-sm">SMART</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Healthy Swaps</h3>
            <p className="text-6xl font-extrabold text-white">{stats.healthySwaps}</p>
            <button className="mt-4 text-white underline font-semibold hover:text-purple-100">
              View Swaps →
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;
