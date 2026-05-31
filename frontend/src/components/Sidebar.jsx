import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Search, ShoppingBag, Snowflake, MessageSquare, User, LogOut } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/discover', icon: Search, label: 'Discover & Swap' },
    { path: '/fridge', icon: Snowflake, label: 'Fridge Meals' },
    { path: '/insights', icon: MessageSquare, label: 'AI Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-[#faf9f6] border-r border-[#e0e8e0] min-h-screen flex flex-col font-sans">
      {/* Logo */}
      <div className="p-8 border-b border-[#e0e8e0]">
        <Link to="/discover" className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-[#6b8e6b]" />
          <h1 className="text-2xl font-serif font-bold text-[#2c3e2d] tracking-tight">
            MoodMeal
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-[#edf2ec] text-[#2c3e2d] shadow-sm'
                  : 'text-[#5c705c] hover:bg-white hover:text-[#2c3e2d]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-[#6b8e6b]' : 'opacity-70'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[#e0e8e0]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl font-medium text-[#c05b5b] bg-white border border-[#f0d8d8] hover:bg-[#fdf4f4] transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;