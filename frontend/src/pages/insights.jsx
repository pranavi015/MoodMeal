import Layout from '../components/Layout';
import { TrendingUp } from 'lucide-react';

function Insights() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Insights & Analytics</h1>

        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <TrendingUp className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h2>
          <p className="text-gray-600">Track meals to unlock personalized insights about your mood and eating patterns.</p>
        </div>
      </div>
    </Layout>
  );
}

export default Insights;