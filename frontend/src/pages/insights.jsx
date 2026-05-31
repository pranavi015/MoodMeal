import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { MessageSquare, Sparkles, Send, BrainCircuit, Activity, Moon, Sun, ArrowRight } from 'lucide-react';

const Insights = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your MoodMeal AI. I analyze your meal logs and how you feel afterward. Ask me anything about your food-mood correlations, like 'Why do pancakes make me tired?'"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const mockHistoricalInsights = [
    {
      title: "Morning Energy Dip",
      desc: "You often report feeling sluggish 2 hours after eating refined carbs for breakfast.",
      icon: <Moon className="w-5 h-5 text-[#8ca38c]" />
    },
    {
      title: "Focus Booster",
      desc: "Meals rich in Omega-3s (like salmon and avocado) correlate with your highest focus days.",
      icon: <BrainCircuit className="w-5 h-5 text-[#6b8e6b]" />
    },
    {
      title: "Afternoon Vitality",
      desc: "Replacing coffee with matcha has stabilized your 3 PM energy crashes.",
      icon: <Sun className="w-5 h-5 text-[#e5b362]" />
    }
  ];

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/insights/chat`,
        { question: userMessage.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setChatHistory(prev => [...prev, { role: 'ai', content: response.data.answer }]);
      }
    } catch (error) {
      console.error("Error fetching AI insight:", error);
      setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I had trouble connecting to the brain! Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <header className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#2c3e2d] mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#6b8e6b]" />
            AI Food-Mood Insights
          </h1>
          <p className="text-lg text-[#5c705c]">Understand your body. Ask questions about your dietary patterns.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          
          {/* Main Chat Area */}
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#e0e8e0] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-5 ${
                    msg.role === 'user' 
                    ? 'bg-[#2c3e2d] text-white rounded-tr-sm' 
                    : 'bg-[#faf9f6] text-[#2c3e2d] border border-[#e0e8e0] rounded-tl-sm'
                  }`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mb-2 font-serif font-bold text-[#6b8e6b]">
                        <BrainCircuit className="w-4 h-4" /> MoodMeal AI
                      </div>
                    )}
                    <p className="leading-relaxed text-[1.05rem]">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#faf9f6] border border-[#e0e8e0] rounded-2xl rounded-tl-sm p-5 flex gap-1">
                    <span className="w-2 h-2 bg-[#a3bfa3] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#a3bfa3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-[#a3bfa3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-[#faf9f6] border-t border-[#e0e8e0]">
              <form onSubmit={handleAsk} className="relative">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Why did pancakes make me tired?" 
                  className="w-full pl-6 pr-16 py-4 bg-white border border-[#e0e8e0] rounded-2xl outline-none focus:border-[#6b8e6b] focus:ring-2 focus:ring-[#6b8e6b]/20 transition-all text-lg shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#6b8e6b] text-white rounded-xl hover:bg-[#597859] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="lg:w-[350px] space-y-6 overflow-y-auto pr-2 pb-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#e0e8e0]">
              <h3 className="font-serif text-xl font-bold text-[#2c3e2d] mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#6b8e6b]" />
                Recent Patterns
              </h3>
              <div className="space-y-4">
                {mockHistoricalInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 bg-[#faf9f6] rounded-xl border border-[#e0e8e0]/50 hover:border-[#6b8e6b]/50 transition-colors cursor-pointer group">
                    <div className="flex gap-3 mb-2">
                      <div className="mt-1 bg-white p-1.5 rounded-lg shadow-sm">
                        {insight.icon}
                      </div>
                      <h4 className="font-bold text-[#2c3e2d] group-hover:text-[#6b8e6b] transition-colors">{insight.title}</h4>
                    </div>
                    <p className="text-[#5c705c] text-sm leading-relaxed">{insight.desc}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-[#6b8e6b] font-medium flex justify-center items-center gap-2 hover:bg-[#edf2ec] rounded-xl transition-colors">
                View All History <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Insights;