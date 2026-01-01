import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Utensils, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const MEAL_TYPES = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'];

function Meals() {
  // State
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterMealType, setFilterMealType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      try {
        // Only send filterMealType if it's not "all"
        const params = {
          page,
          limit,
          search: search || "",
          sortBy,
          sortOrder,
        };
        if (filterMealType && filterMealType !== "all") {
          params.filterMealType = filterMealType;
        }

        const query = new URLSearchParams(params).toString();
        const res = await api.get(`api/meals?${query}`);

        setMeals(res.data.meals || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching meals:", error.message);
        setMeals([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [page, limit, search, sortBy, sortOrder, filterMealType]);


  // Handlers
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const handleFilterClick = (type) => {
    setFilterMealType(type);
    setPage(1);
  };

  const goToPage = (pageNum) => {
    setPage(pageNum);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;

    try {
      await api.delete(`/api/meals/${id}`);

      // update local state so UI refreshes without reloading
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete meal.");
    }
  };

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => goToPage(i)}
        className={`px-3 py-1 rounded ${page === i ? 'bg-green-400 text-white' : 'bg-gray-200'}`}
      >
        {i}
      </button>
    );
  }

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">My Meals</h1>
          <Link
            to="/meal-logger"
            className="flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-xl font-bold hover:bg-green-500"
          >
            <Plus className="w-5 h-5" />
            Log New Meal
          </Link>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          {/* Search */}
          <input
            type="text"
            placeholder="Search meals by food..."
            value={search}
            onChange={handleSearchChange}
            className="border rounded px-4 py-2 w-full md:w-1/3"
          />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={handleSortChange} className="border rounded px-3 py-2">
              <option value="timestamp">Sort by Date</option>
              <option value="mealType">Sort by Meal Type</option>
            </select>

            <select value={sortOrder} onChange={handleSortOrderChange} className="border rounded px-3 py-2">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {MEAL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => handleFilterClick(type)}
                className={`px-4 py-2 rounded font-semibold ${filterMealType === type ? 'bg-green-400 text-white' : 'bg-gray-200'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">Loading meals...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && meals.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Utensils className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No meals logged yet</h2>
            <p className="text-gray-600 mb-8">
              Start tracking your meals to see insights about your eating habits!
            </p>
            <button>
              <Link
                to="/meal-logger"
                className="flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-xl font-bold hover:bg-green-500"
              >
                <Plus className="w-5 h-5" />
                Log New Meal
              </Link>
            </button>
          </div>
        )}

        {/* Meals Grid */}
        {!loading && meals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {meals.map(meal => (
              <div
              key={meal.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header with Meal name + Mood Badge */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{meal.foods}</h2>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    meal.moodAfter === 'light' ? 'bg-green-200 text-green-800' :
                    meal.moodAfter === 'heavy' ? 'bg-red-200 text-red-800' :
                    'bg-gray-200 text-gray-600'
                  }`}
                  title={`Mood: ${meal.moodAfter || 'unsure'}`}
                >
                  {meal.moodAfter || 'unsure'} {meal.moodAfter === 'light' ? 'light'+'😀' : meal.moodAfter === 'heavy' ? 'heavy'+'🙁': '😐'}
                </span>
              </div>
            
              {/* Optional Photo */}
              {meal.photo && (
                <img
                  src={meal.photo}
                  alt={`${meal.mealType} photo`}
                  className="w-full h-44 object-cover rounded-lg mb-4 shadow-sm"
                />
              )}
            
              {/* Meal Type Badge */}
              {meal.mealType && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded uppercase mb-2">
                  {meal.mealType}
                </span>
              )}
            
              {/* Notes */}
              {meal.notes && <p className="text-gray-700 mb-4">{meal.notes}</p>}
            
              {/* Timestamp */}
              <p className="text-xs text-gray-400 mb-5 italic">
                {meal.timestamp ? new Date(meal.timestamp).toLocaleString() : "No timestamp"}
              </p>
            
              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                  onClick={() => navigate(`/meal-logger/${meal.id}`)}
                  aria-label="Edit meal"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
            
                <button
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                  onClick={() => handleDelete(meal.id)}
                  aria-label="Delete meal"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
            
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {paginationButtons}

            <button
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Meals;