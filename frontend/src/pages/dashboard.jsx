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
      <Layout>
        <div className="p-8 animate-pulse">
          {/* Skeleton Welcome Card */}
          <div className="bg-[#F0FDF4] rounded-3xl p-5 mb-8 h-[88px] border border-[#BBF7D0]"></div>
          
          {/* Skeleton Button */}
          <div className="mb-8 w-[160px] h-[60px] bg-gray-200 rounded-[12px]"></div>
          
          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-200 h-[216px] rounded-2xl"></div>
            <div className="bg-gray-200 h-[216px] rounded-2xl"></div>
            <div className="bg-gray-200 h-[216px] rounded-2xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Welcome Card */}
        <div className="bg-[#F0FDF4] rounded-3xl p-5 mb-8 border border-[#BBF7D0]">
          <h2 className="text-[22px] md:text-2xl font-extrabold text-[#0F172A] mb-2">
            Welcome back, {user.name}!
          </h2>
          {/* <p className="text-[#64748B] text-base">
            <span className="font-semibold">Email:</span> {user.email}
          </p> */}
        </div>

        {/* Quick Action Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/meals')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#22C55E] text-white rounded-[12px] font-bold text-lg shadow-[0_4px_10px_rgba(34,197,94,0.25)] hover:bg-[#16A34A] active:bg-[#15803D] transform transition-all"
            aria-label="Log a new meal"
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
            className="bg-[#22C55E] p-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] cursor-pointer transform hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)] transition-all group"
            aria-label="View meals tracked"
          >
            <div className="flex items-center justify-between mb-4">
              <Utensils className="w-12 h-12 text-white/90 stroke-[2.5]" />
              <div className="bg-white/20 px-3 py-1 rounded">
                <span className="text-white font-semibold text-xs">NEW</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Meals Tracked</h3>
            <p className="text-5xl font-extrabold text-white">{stats.mealsTracked}</p>
            <button className="mt-4 text-white font-medium group-hover:underline transition-all">
              View All Meals →
            </button>
          </div>

          {/* Mood Logs Card */}
          <div
            onClick={() => navigate('/insights')}
            className="bg-[#3B82F6] p-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] cursor-pointer transform hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)] transition-all group"
            aria-label="View mood logs"
          >
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-12 h-12 text-white/90 stroke-[2.5]" />
              <div className="bg-white/20 px-3 py-1 rounded">
                <span className="text-white font-semibold text-xs">TRACK</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mood Logs</h3>
            <p className="text-5xl font-extrabold text-white">{stats.moodLogs}</p>
            <button className="mt-4 text-white font-medium group-hover:underline transition-all">
              View Insights →
            </button>
          </div>

          {/* Healthy Swaps Card */}
          <div
            onClick={() => navigate('/swaps')}
            className="bg-[#A855F7] p-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] cursor-pointer transform hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)] transition-all group"
            aria-label="View healthy swaps"
          >
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-12 h-12 text-white/90 stroke-[2.5]" />
              <div className="bg-white/20 px-3 py-1 rounded">
                <span className="text-white font-semibold text-xs">SMART</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Healthy Swaps</h3>
            <p className="text-5xl font-extrabold text-white">{stats.healthySwaps}</p>
            <button className="mt-4 text-white font-medium group-hover:underline transition-all">
              View Swaps →
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;
