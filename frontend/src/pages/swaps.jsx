import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Swaps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [customSwaps, setCustomSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    originalFood: '',
    healthyAlternative: '',
    description: ''
  });


  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch user's custom swaps on load
  useEffect(() => {
    fetchCustomSwaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomSwaps = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/swaps`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        setCustomSwaps(data.swaps || []);
      }
    } catch (err) {
      console.error('Error fetching custom swaps:', err.message);
    }
  };

  // Search for swap suggestions
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}/api/swaps/search?food=${encodeURIComponent(searchTerm)}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.found) {
          setSearchResults(data.suggestions);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(true);
          setError('No preset swaps found. Create your own custom swap below!');
        }
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create or update custom swap
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const url = editingId 
      ? `${API_URL}/api/swaps/${editingId}` 
      : `${API_URL}/api/swaps`;
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          originalFood: '',
          healthyAlternative: '',
          description: ''
        });
        fetchCustomSwaps();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error(err);
    }
  };

  // Edit custom swap
  const handleEdit = (swap) => {
    setEditingId(swap.id);
    setFormData({
      originalFood: swap.originalFood,
      healthyAlternative: swap.healthyAlternative,
      description: swap.description || ''
    });
    setShowForm(true);
  };

  // Delete custom swap
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this swap?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/swaps/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchCustomSwaps();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete swap');
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error(err);
    }
  };

  return (
  <Layout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Healthy Swaps</h1>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Find Healthy Alternatives</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a food (e.g., pizza, chocolate, chips)..."
              className="flex-1 border rounded-lg px-4 py-3 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <p className="text-orange-600 mt-4 text-sm">{error}</p>
          )}
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Swap Suggestions for "{searchTerm}"
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-lg shadow-md border-2 border-green-200"
                >
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase mb-1">Instead of:</p>
                    <p className="font-semibold text-lg line-through text-gray-400">
                      {result.originalFood}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Try:</p>
                    <p className="font-semibold text-lg text-green-600">
                      {result.healthyAlternative}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Swaps Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Custom Swaps</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  originalFood: '',
                  healthyAlternative: '',
                  description: ''
                });
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : '+ Add Custom Swap'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? 'Edit Custom Swap' : 'Create Custom Swap'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Original Food</label>
                  <input
                    type="text"
                    required
                    value={formData.originalFood}
                    onChange={(e) => setFormData({...formData, originalFood: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Fried chicken"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Healthy Alternative</label>
                  <input
                    type="text"
                    required
                    value={formData.healthyAlternative}
                    onChange={(e) => setFormData({...formData, healthyAlternative: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Air-fried chicken"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="2"
                    placeholder="Why this swap works for you..."
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update Swap' : 'Create Swap'}
                </button>
              </form>
            </div>
          )}

          {/* Custom Swaps List */}
          {customSwaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customSwaps.map((swap) => (
                <div key={swap.id} className="bg-white p-5 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Custom
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(swap)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(swap.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase mb-1">Instead of:</p>
                    <p className="font-semibold text-lg line-through text-gray-400">
                      {swap.originalFood}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase mb-1">Try:</p>
                    <p className="font-semibold text-lg text-blue-600">
                      {swap.healthyAlternative}
                    </p>
                  </div>

                  {swap.description && (
                    <p className="text-sm text-gray-600 italic mt-2">
                      "{swap.description}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No custom swaps yet. Create your first one!</p>
            </div>
          )}
        </div>

      </div>
    </div>
    </Layout>)
}