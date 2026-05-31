import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Plus, X, Sparkles, ChefHat, Clock } from 'lucide-react';

const Fridge = () => {
  const [ingredients, setIngredients] = useState(['Eggs', 'Spinach', 'Cherry Tomatoes']);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState(null);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingToRemove) => {
    setIngredients(ingredients.filter(ing => ing !== ingToRemove));
  };

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const generateRecipe = async () => {
    if (ingredients.length === 0) return;
    setIsGenerating(true);
    setRecipe(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/fridge/generate`,
        { ingredients },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRecipe(response.data);
    } catch (error) {
      console.error("Error generating fridge recipe:", error);
      // Optional: Add a UI toast/error message here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="p-10 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <ChefHat className="w-12 h-12 text-[#6b8e6b] mx-auto mb-6" />
          <h1 className="text-4xl font-serif font-bold text-[#2c3e2d] mb-4">What's in your fridge?</h1>
          <p className="text-lg text-[#5c705c] max-w-2xl mx-auto">Tell us what ingredients you have on hand, and we'll craft a healthy, delicious meal just for you.</p>
        </header>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#e0e8e0] mb-12">
          <form onSubmit={handleAddIngredient} className="relative mb-8 max-w-2xl mx-auto">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add an ingredient (e.g. Avocado, Quinoa, Chicken...)" 
              className="w-full px-6 py-4 bg-[#faf9f6] border border-[#e0e8e0] rounded-full outline-none focus:border-[#6b8e6b] focus:ring-2 focus:ring-[#6b8e6b]/20 transition-all text-lg pr-16"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 bottom-2 w-12 bg-[#2c3e2d] text-white rounded-full flex items-center justify-center hover:bg-[#3a523b] transition-colors disabled:opacity-50 disabled:hover:bg-[#2c3e2d]"
            >
              <Plus className="w-6 h-6" />
            </button>
          </form>

          <div className="flex flex-wrap gap-3 justify-center mb-10 min-h-[60px]">
            {ingredients.length === 0 ? (
              <p className="text-[#a3bfa3] italic mt-2">Your fridge is empty...</p>
            ) : (
              ingredients.map((ing) => (
                <div key={ing} className="animate-in fade-in zoom-in duration-300 flex items-center gap-2 px-4 py-2 bg-[#edf2ec] text-[#2c3e2d] border border-[#c1d5c0]/50 rounded-full font-medium">
                  {ing}
                  <button onClick={() => removeIngredient(ing)} className="text-[#8ca38c] hover:text-[#c05b5b] transition-colors focus:outline-none">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <button 
              onClick={generateRecipe}
              disabled={ingredients.length === 0 || isGenerating}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6b8e6b] text-white rounded-full font-medium text-lg hover:bg-[#597859] transition-all shadow-md shadow-[#6b8e6b]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Crafting Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Generate Magic Meal
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recipe Result */}
        {recipe && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white rounded-[2rem] overflow-hidden shadow-xl border border-[#e0e8e0]/50">
            <div className="bg-[#2c3e2d] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] mix-blend-overlay"></div>
              <h2 className="relative z-10 font-serif text-3xl md:text-4xl font-bold text-white mb-4">{recipe.name}</h2>
              <div className="relative z-10 flex items-center justify-center gap-6 text-[#a3bfa3]">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {recipe.time}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b8e6b]"></span>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
            
            <div className="p-10 flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <h3 className="font-serif text-xl font-bold text-[#2c3e2d] mb-4 border-b border-[#e0e8e0] pb-2">Ingredients Used</h3>
                <ul className="space-y-3">
                  {ingredients.map(ing => (
                    <li key={ing} className="flex items-center gap-3 text-[#4a5d4a]">
                      <div className="w-2 h-2 rounded-full bg-[#6b8e6b]"></div>
                      {ing}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-[#8ca38c] italic text-sm mt-4">
                    <Plus className="w-4 h-4" /> Pantry staples (salt, pepper, olive oil)
                  </li>
                </ul>
              </div>
              
              <div className="md:w-2/3">
                <h3 className="font-serif text-xl font-bold text-[#2c3e2d] mb-4 border-b border-[#e0e8e0] pb-2">Instructions</h3>
                <p className="text-[#5c705c] mb-6 font-medium">{recipe.description}</p>
                <ol className="space-y-6">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#edf2ec] text-[#6b8e6b] font-bold flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <p className="text-[#4a5d4a] pt-1 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fridge;
