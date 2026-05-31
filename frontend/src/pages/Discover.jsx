import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Search, ArrowRight, Heart, Sparkles, Filter } from 'lucide-react';

const Discover = () => {
  const [activeTab, setActiveTab] = useState('meals'); // 'meals' or 'swaps'
  const [cravingInput, setCravingInput] = useState('');
  const [swapResult, setSwapResult] = useState(null);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const [discoverMeals, setDiscoverMeals] = useState([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/feed/meals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDiscoverMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setIsLoadingMeals(false);
      }
    };
    fetchMeals();
  }, []);

  const [isSearching, setIsSearching] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const executeSwapSearch = async () => {
    if (!cravingInput) return;
    
    setIsSearching(true);
    setSwapResult(null);
    setGeneratedRecipe(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/swaps/ai-swap`,
        { craving: cravingInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSwapResult({
          craving: cravingInput,
          ...response.data.swap
        });
      }
    } catch (error) {
      console.error("Error fetching AI swap:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSwapSearch = (e) => {
    e.preventDefault();
    executeSwapSearch();
  };

  const handleGenerateRecipe = async () => {
    if (!swapResult || !swapResult.suggestion) return;
    
    setIsGeneratingRecipe(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/swaps/ai-recipe`,
        { suggestion: swapResult.suggestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setGeneratedRecipe(response.data.recipe);
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return (
    <Layout>
      <div className="p-10 max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#2c3e2d] mb-4">Discover & Swap</h1>
          <p className="text-lg text-[#5c705c]">Find nourishing meals or swap your cravings for healthier alternatives.</p>
        </header>

        {/* Custom Tabs */}
        <div className="flex gap-4 mb-10 border-b border-[#e0e8e0] pb-px">
          <button 
            onClick={() => setActiveTab('meals')}
            className={`pb-4 px-2 text-lg font-medium transition-colors relative ${activeTab === 'meals' ? 'text-[#2c3e2d]' : 'text-[#8ca38c] hover:text-[#5c705c]'}`}
          >
            Healthy Meals
            {activeTab === 'meals' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6b8e6b] rounded-t-full"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('swaps')}
            className={`pb-4 px-2 text-lg font-medium transition-colors relative ${activeTab === 'swaps' ? 'text-[#2c3e2d]' : 'text-[#8ca38c] hover:text-[#5c705c]'}`}
          >
            Craving Swaps
            {activeTab === 'swaps' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6b8e6b] rounded-t-full"></span>}
          </button>
        </div>

        {activeTab === 'meals' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8ca38c]" />
                <input 
                  type="text" 
                  placeholder="Search meals, ingredients..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#e0e8e0] rounded-2xl outline-none focus:border-[#6b8e6b] focus:ring-2 focus:ring-[#6b8e6b]/20 transition-all shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-[#e0e8e0] rounded-2xl text-[#5c705c] hover:bg-[#edf2ec] transition-colors shadow-sm ml-4">
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingMeals ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-[#8ca38c]">
                  <div className="w-8 h-8 border-4 border-[#e0e8e0] border-t-[#6b8e6b] rounded-full animate-spin mb-4"></div>
                  <p>Generating personalized meal ideas...</p>
                </div>
              ) : discoverMeals.length > 0 ? (
                discoverMeals.map((meal, index) => (
                  <div key={index} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-[#e0e8e0]/50">
                    <div className="h-48 overflow-hidden relative">
                      <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#6b8e6b] hover:bg-white transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {meal.tags?.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-[#edf2ec] text-[#4a5d4a] text-xs font-semibold rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#2c3e2d] mb-2 group-hover:text-[#6b8e6b] transition-colors">{meal.name}</h3>
                      <p className="text-[#5c705c] text-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6b8e6b] block"></span>
                        Prep: {meal.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-[#8ca38c]">No meals found.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#e0e8e0] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#edf2ec] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10">
                <h2 className="font-serif text-2xl font-bold text-[#2c3e2d] mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#6b8e6b]" />
                  What are you craving?
                </h2>
                <p className="text-[#5c705c] mb-6">Tell us what you want to eat, and our AI will suggest a healthier alternative that hits the same spot.</p>
                
                <form onSubmit={handleSwapSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
                  <input 
                    type="text" 
                    value={cravingInput}
                    onChange={(e) => setCravingInput(e.target.value)}
                    placeholder="e.g. A huge bowl of ice cream" 
                    className="flex-1 px-5 py-4 bg-[#faf9f6] border border-[#e0e8e0] rounded-2xl outline-none focus:border-[#6b8e6b] focus:ring-2 focus:ring-[#6b8e6b]/20 transition-all text-lg"
                  />
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="px-8 py-4 bg-[#2c3e2d] text-white rounded-2xl font-medium hover:bg-[#3a523b] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSearching ? "Searching..." : (
                      <>Find Swap <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>

                {swapResult && (
                  <div className="bg-[#edf2ec] rounded-2xl p-6 border border-[#c1d5c0]/30 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-serif text-xl font-bold text-[#2c3e2d]">We suggest: <br/><span className="text-[#6b8e6b]">{swapResult.suggestion}</span></h3>
                      <span className="px-3 py-1 bg-white text-[#6b8e6b] text-sm font-bold rounded-full shadow-sm">
                        {swapResult.matchScore} Match
                      </span>
                    </div>
                    <p className="text-[#4a5d4a] leading-relaxed">
                      {swapResult.reason}
                    </p>
                    <div className="mt-6 flex gap-4">
                      <button 
                        onClick={handleGenerateRecipe}
                        disabled={isGeneratingRecipe}
                        className="px-5 py-2.5 bg-[#6b8e6b] text-white rounded-xl font-medium hover:bg-[#597859] transition-colors shadow-sm min-w-[140px] flex justify-center items-center disabled:opacity-50"
                      >
                        {isGeneratingRecipe ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : "Generate Recipe"}
                      </button>
                      <button 
                        onClick={executeSwapSearch}
                        disabled={isSearching}
                        className="px-5 py-2.5 bg-white border border-[#c1d5c0] text-[#4a5d4a] rounded-xl font-medium hover:bg-[#f4f7f4] transition-colors disabled:opacity-50"
                      >
                        Try Another
                      </button>
                    </div>

                    {generatedRecipe && (
                      <div className="mt-6 pt-6 border-t border-[#c1d5c0]/40 animate-in fade-in slide-in-from-top-4">
                        <h4 className="font-serif text-xl font-bold text-[#2c3e2d] mb-3">{generatedRecipe.name}</h4>
                        <div className="flex gap-3 mb-6 text-[#5c705c] text-sm font-medium">
                          <span className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-[#e0e8e0]">{generatedRecipe.time}</span>
                          <span className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-[#e0e8e0]">{generatedRecipe.servings}</span>
                        </div>
                        <div className="mb-6 bg-white p-5 rounded-2xl border border-[#e0e8e0] shadow-sm">
                          <h5 className="font-bold text-[#4a5d4a] mb-3">Ingredients</h5>
                          <ul className="list-disc list-inside text-[#5c705c] space-y-1.5">
                            {generatedRecipe.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
                          </ul>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-[#e0e8e0] shadow-sm">
                          <h5 className="font-bold text-[#4a5d4a] mb-3">Instructions</h5>
                          <ol className="list-decimal list-inside text-[#5c705c] space-y-2.5">
                            {generatedRecipe.instructions?.map((step, i) => <li key={i} className="pl-1">{step}</li>)}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Discover;
