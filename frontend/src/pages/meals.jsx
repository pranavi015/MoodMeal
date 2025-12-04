import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Utensils, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { Link } from "react-router-dom";


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
        console.error("Error fetching meals:", error);
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
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`${API_URL}/api/meals/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete meal.");
        return;
      }
  
      // Refresh your meal list after deletion
      fetchMeals(); // <-- Make sure you have this function in your component
  
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error. Please try again.");
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
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 capitalize">{meal.foods}</h2>
                  <span className="text-3xl">{meal.moodAfter || 'unsure'}</span>
                </div>

                {meal.photo && (
                  <img
                    src={meal.photo}
                    alt={`${meal.mealType} photo`}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}
                {meal.mealType && <p className="text-l font-bold text-gray-600 capitalize">{meal.mealType}</p>}
                {meal.notes && <p className="text-gray-600 mb-4">{meal.notes}</p>}

                <p className="text-sm text-gray-400 mb-4">
                  {meal.timestamp ? new Date(meal.timestamp).toLocaleString() : "No timestamp"}
                </p>

                {/* Edit/Delete Buttons */}
                <div className="flex gap-4">
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                    onClick={() => navigate(`/meal-logger/${meal.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>


                  <button
                    className="flex items-center gap-2 text-red-600 hover:underline"
                    onClick={() => handleDelete(meal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
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

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// export default function Meals() {
//   const [meals, setMeals] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [filter, setFilter] = useState("all");

//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   // -----------------------------
//   // Fetch Meals
//   // -----------------------------
//   const fetchMeals = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(`/api/meals`, {
//         params: {
//           page,
//           search,
//           sort,
//           filter,
//         },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMeals(res.data.meals);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       console.error("Error fetching meals:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMeals();
//   }, [page, search, sort, filter]);

//   // -----------------------------
//   // Delete Meal
//   // -----------------------------
//   const handleDelete = async (id) => {
//     if (!confirm("Delete this meal?")) return;

//     try {
//       await axios.delete(`/api/meals/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchMeals(); // refresh
//     } catch (err) {
//       console.error("Error deleting meal:", err);
//     }
//   };

//   // -----------------------------
//   // UI Starts Here
//   // -----------------------------
//   return (
//     <div className="p-6 space-y-6">
//       {/* Page Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Meals</h1>

//         <Link
//           to="/meal-logger"
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           Log New Meal
//         </Link>
//       </div>

//       {/* Search + Sort + Filters */}
//       <div className="flex flex-wrap gap-3 items-center">

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search meals..."
//           className="border p-2 rounded-lg w-64"
//           value={search}
//           onChange={(e) => {
//             setPage(1);
//             setSearch(e.target.value);
//           }}
//         />

//         {/* Sort */}
//         <select
//           className="border p-2 rounded-lg"
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//         >
//           <option value="newest">Newest First</option>
//           <option value="oldest">Oldest First</option>
//           <option value="mealType">Meal Type</option>
//         </select>

//         {/* Filters */}
//         {["all", "breakfast", "lunch", "dinner", "snack"].map((f) => (
//           <button
//             key={f}
//             onClick={() => {
//               setFilter(f);
//               setPage(1);
//             }}
//             className={`px-3 py-1 rounded-lg border ${
//               filter === f ? "bg-blue-600 text-white" : "bg-gray-100"
//             }`}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Meals List */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : meals.length === 0 ? (
//         <p className="text-gray-500">No meals found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {meals.map((meal) => (
//             <div
//               key={meal.id}
//               className="border p-4 rounded-xl shadow-sm bg-white"
//             >
//               <div className="flex justify-between">
//                 <h3 className="text-xl font-semibold capitalize">
//                   {meal.mealType}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {new Date(meal.timestamp).toLocaleString()}
//                 </p>
//               </div>

//               <p className="mt-2 text-gray-700">
//                 <strong>Foods:</strong> {meal.foods.join(", ")}
//               </p>

//               <p className="text-gray-700">
//                 <strong>Mood:</strong> {meal.mood}
//               </p>

//               {/* Edit + Delete */}
//               <div className="flex gap-2 mt-4">
//                 <Link
//                   to={`/meals/edit/${meal.id}`}
//                   className="px-3 py-1 bg-yellow-500 text-white rounded-lg"
//                 >
//                   Edit
//                 </Link>

//                 <button
//                   onClick={() => handleDelete(meal.id)}
//                   className="px-3 py-1 bg-red-600 text-white rounded-lg"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex gap-2 mt-6">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1 border rounded ${
//                 page === i + 1 ? "bg-blue-600 text-white" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
