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
        className={`w-9 h-9 flex items-center justify-center rounded-lg font-medium transition-all ${page === i ? 'bg-[#22C55E] text-white' : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] focus:ring-2 focus:ring-[#22C55E] focus:outline-none'}`}
        aria-label={`Go to page ${i}`}
      >
        {i}
      </button>
    );
  }

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">My Meals</h1>
          <Link
            to="/meal-logger"
            className="flex items-center gap-2 px-[16px] py-[10px] bg-[#22C55E] text-white rounded-xl font-bold shadow-[0_4px_10px_rgba(34,197,94,0.25)] hover:bg-[#16A34A] transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#22C55E] focus:outline-none w-fit"
          >
            <Plus className="w-5 h-5" />
            Log New Meal
          </Link>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

          {/* Search */}
          <input
            type="text"
            placeholder="Search meals by food..."
            value={search}
            onChange={handleSearchChange}
            className="h-10 border border-[#E5E7EB] rounded-[10px] px-3 bg-[#FFFFFF] w-full lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent text-[#0F172A]"
            aria-label="Search meals"
          />

          {/* Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select value={sortBy} onChange={handleSortChange} className="h-10 border border-[#E5E7EB] rounded-[10px] px-3 bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent text-[#0F172A] w-full sm:w-auto">
              <option value="timestamp">Sort by Date</option>
              <option value="mealType">Sort by Meal Type</option>
            </select>

            <select value={sortOrder} onChange={handleSortOrderChange} className="h-10 border border-[#E5E7EB] rounded-[10px] px-3 bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent text-[#0F172A] w-full sm:w-auto">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full lg:w-auto">
            {MEAL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => handleFilterClick(type)}
                className={`px-4 h-10 rounded-[10px] font-medium whitespace-nowrap transition-all focus:ring-2 focus:ring-[#22C55E] focus:outline-none ${filterMealType === type ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'
                  }`}
                aria-pressed={filterMealType === type}
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
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] p-12 text-center shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
            <Utensils className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-[#0F172A] mb-2">
              {search ? `No results found for '${search}'` : "No meals yet"}
            </h2>
            <p className="text-[#64748B] mb-6">
              {search ? "Try adjusting your search or filters." : "Start by logging your first meal."}
            </p>
            {!search && (
              <Link
                to="/meal-logger"
                className="inline-flex items-center gap-2 px-[16px] py-[10px] bg-[#22C55E] text-white rounded-xl font-bold shadow-[0_4px_10px_rgba(34,197,94,0.25)] hover:bg-[#16A34A] transition-all"
              >
                <Plus className="w-5 h-5" />
                Log New Meal
              </Link>
            )}
          </div>
        )}

        {/* Meals Grid */}
        {!loading && meals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {meals.map(meal => (
              <div
              key={meal.id}
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] p-[16px] hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col min-h-[180px] cursor-pointer"
              onClick={(e) => {
                // Prevent navigation if clicking actions
                if (!e.target.closest('button')) {
                  navigate(`/meal-logger/${meal.id}`);
                }
              }}
            >
              {/* Header with Meal name + Mood Badge */}
              <div className="flex justify-between items-start mb-3 gap-2">
                <h2 className="text-[18px] font-semibold text-[#0F172A] leading-tight line-clamp-2">
                  {meal.foods ? meal.foods.charAt(0).toUpperCase() + meal.foods.slice(1).toLowerCase() : 'Unnamed Meal'}
                </h2>
                <span
                  className={`shrink-0 inline-block px-3 py-1 rounded-full text-[12px] font-medium
                  ${
                    meal.moodAfter?.toLowerCase() === 'light' ? 'bg-[#DCFCE7] text-[#166534]' :
                    meal.moodAfter?.toLowerCase() === 'heavy' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                    meal.moodAfter?.toLowerCase() === 'satisfied' ? 'bg-[#E2E8F0] text-[#334155]' :
                    'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                  title={`Mood: ${meal.moodAfter || 'unsure'}`}
                >
                  {meal.moodAfter ? meal.moodAfter.charAt(0).toUpperCase() + meal.moodAfter.slice(1).toLowerCase() : 'Unsure'}
                </span>
              </div>
            
              {/* Optional Photo */}
              {meal.photo && (
                <img
                  src={meal.photo}
                  alt={`${meal.mealType || 'Meal'} photo`}
                  className="w-full h-44 object-cover rounded-lg mb-4 shadow-sm"
                />
              )}
            
              {/* Meal Type Badge */}
              {meal.mealType && (
                <span className="inline-block bg-[#EEF2FF] text-[#3730A3] text-[12px] font-medium px-2 py-1 rounded-[6px] uppercase mb-2 w-fit">
                  {meal.mealType}
                </span>
              )}
            
              {/* Notes */}
              {meal.notes && <p className="text-[#475569] text-sm mb-4 line-clamp-2">{meal.notes}</p>}
            
              <div className="flex-grow"></div>
            
              <div className="flex items-center justify-between mt-4">
                {/* Timestamp */}
                <p className="text-[12px] text-[#64748B]">
                  {meal.timestamp 
                    ? `${new Date(meal.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${new Date(meal.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` 
                    : "No timestamp"}
                </p>
              
                {/* Actions */}
                <div className="flex justify-end gap-4">
                  <button
                    className="flex items-center gap-1.5 text-[#475569] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] rounded p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/meal-logger/${meal.id}`);
                    }}
                    aria-label="Edit meal"
                  >
                    <Edit className="w-[18px] h-[18px]" />
                  </button>
              
                  <button
                    className="flex items-center gap-1.5 text-[#475569] hover:text-[#DC2626] transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626] rounded p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(meal.id);
                    }}
                    aria-label="Delete meal"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
            
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              className="px-4 h-9 flex items-center bg-[#F1F5F9] text-[#334155] font-medium rounded-lg disabled:opacity-50 hover:bg-[#E2E8F0] transition-colors focus:ring-2 focus:ring-[#22C55E] focus:outline-none"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {paginationButtons}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
              className="px-4 h-9 flex items-center bg-[#F1F5F9] text-[#334155] font-medium rounded-lg disabled:opacity-50 hover:bg-[#E2E8F0] transition-colors focus:ring-2 focus:ring-[#22C55E] focus:outline-none"
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