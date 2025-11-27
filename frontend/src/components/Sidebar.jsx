import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, Utensils, Heart, Sparkles, User, LogOut, TrendingUp } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/meals', icon: Utensils, label: 'My Meals' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/swaps', icon: Sparkles, label: 'Healthy Swaps' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center">
          <Leaf className="w-8 h-8 mr-2 text-[#4ADE80]" />
          <h1 className="text-xl font-extrabold text-gray-900">
            Mood<span className="text-[#4ADE80]">Meal</span>
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive(item.path)
                  ? 'bg-[#4ADE80] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>


      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;