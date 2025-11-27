import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Utensils, Plus } from 'lucide-react';
import api from '../utils/api';

function Meals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const res = await api.get('/meals');
        const data = res.data.meals || res.data || [];
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">My Meals</h1>

          <button className="flex items-center gap-2 px-6 py-3 bg-[#4ADE80] text-white rounded-xl font-bold hover:bg-[#3BC96E] transition-all">
            <Plus className="w-5 h-5" />
            Log New Meal
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">Loading meals...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && meals.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Utensils className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No meals logged yet</h2>
            <p className="text-gray-600 mb-8">
              Start tracking your meals to see insights about your eating habits!
            </p>
            <button className="px-8 py-4 bg-[#4ADE80] text-white rounded-xl font-bold text-lg hover:bg-[#3BC96E] transition-all">
              Log Your First Meal
            </button>
          </div>
        )}

        {/* Meals Grid */}
        {!loading && meals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{meal.name}</h2>
                  <span className="text-3xl">{meal.mood}</span>
                </div>

                {meal.photo && (
                  <img
                    src={meal.photo}
                    alt={meal.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}

                {meal.notes && (
                  <p className="text-gray-600 mb-4">{meal.notes}</p>
                )}

                <p className="text-sm text-gray-400">
                  {new Date(meal.timestamp).toLocaleString()}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
    </Layout>
  );
}

export default Meals;
