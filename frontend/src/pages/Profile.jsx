import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User, Mail, Calendar } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return null;

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">My Profile</h1>

        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">MoodMeal Member</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Mail className="w-6 h-6 text-[#4ADE80]" />
              <div>
                <p className="text-sm text-gray-600 font-semibold">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <User className="w-6 h-6 text-[#4ADE80]" />
              <div>
                <p className="text-sm text-gray-600 font-semibold">User ID</p>
                <p className="text-gray-800">#{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;