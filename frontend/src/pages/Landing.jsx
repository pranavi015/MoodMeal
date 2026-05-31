import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ChefHat, Heart, Star, ArrowRight, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c3e2d] font-sans selection:bg-[#c1d5c0] selection:text-[#2c3e2d]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Leaf className="text-[#6b8e6b] w-8 h-8" />
          <span className="font-serif text-2xl font-bold tracking-tight text-[#2c3e2d]">MoodMeal</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4a5d4a]">
          <a href="#about" className="hover:text-[#2c3e2d] transition-colors">Our Story</a>
          <a href="#menu" className="hover:text-[#2c3e2d] transition-colors">Menu</a>
          <a href="#benefits" className="hover:text-[#2c3e2d] transition-colors">Benefits</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-[#6b8e6b] transition-colors hidden sm:block">Log In</Link>
          <Link to="/signup" className="px-6 py-2.5 rounded-full bg-[#2c3e2d] text-white text-sm font-medium hover:bg-[#3a523b] transition-all shadow-md shadow-[#2c3e2d]/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-12 pb-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Floating elements */}
        <Leaf className="absolute top-10 left-10 text-[#a3bfa3]/40 w-12 h-12 rotate-45 blur-[1px]" />
        <Leaf className="absolute bottom-20 left-1/3 text-[#a3bfa3]/30 w-8 h-8 -rotate-12" />
        <Leaf className="absolute top-32 right-1/3 text-[#a3bfa3]/40 w-10 h-10 rotate-90 blur-[2px]" />

        <div className="lg:w-1/2 z-10 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#edf2ec] text-[#4a5d4a] text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6b8e6b]"></span>
            Fresh & Organic Daily
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl leading-[1.1] text-[#2c3e2d] mb-6">
            Nourish your <br />
            <span className="italic text-[#6b8e6b]">body & soul</span>
          </h1>
          <p className="text-lg text-[#4a5d4a] mb-8 max-w-md leading-relaxed">
            Experience the harmony of wholesome ingredients and mindful eating. Premium healthy meals crafted to elevate your mood and energy.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/signup" className="px-8 py-4 rounded-full bg-[#6b8e6b] text-white text-base font-medium hover:bg-[#597859] transition-all shadow-lg shadow-[#6b8e6b]/30 flex items-center gap-2 group">
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#about" className="px-8 py-4 rounded-full bg-white text-[#2c3e2d] text-base font-medium hover:bg-[#f0f0f0] transition-all shadow-sm border border-[#e0e8e0]">
              Learn More
            </a>
          </div>
        </div>

        <div className="lg:w-1/2 relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
          <div className="absolute inset-0 bg-[#e3ece3] rounded-full blur-3xl opacity-60 translate-x-10 translate-y-10"></div>
          <img 
            src="/images/hero-food.png" 
            alt="Delicious avocado toast" 
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl relative z-10"
            style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
          />
        </div>
      </section>

      {/* Info Bar */}
      <div className="max-w-6xl mx-auto px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-[#2c3e2d]/5 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#edf2ec] flex items-center justify-center text-[#6b8e6b]">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#2c3e2d]">100% Organic</h4>
              <p className="text-sm text-[#5c705c]">Locally sourced greens</p>
            </div>
          </div>
          <div className="w-px h-12 bg-[#e0e8e0] hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#edf2ec] flex items-center justify-center text-[#6b8e6b]">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#2c3e2d]">Chef Crafted</h4>
              <p className="text-sm text-[#5c705c]">Expertly balanced flavors</p>
            </div>
          </div>
          <div className="w-px h-12 bg-[#e0e8e0] hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#edf2ec] flex items-center justify-center text-[#6b8e6b]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#2c3e2d]">Mood Boosting</h4>
              <p className="text-sm text-[#5c705c]">Designed for wellbeing</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-24 px-8 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 relative">
          <div className="absolute inset-0 bg-[#f0e6dd] rounded-[3rem] blur-2xl opacity-50 -translate-x-6 -translate-y-6"></div>
          <img 
            src="/images/about-food.png" 
            alt="Healthy buddha bowl" 
            className="w-full aspect-[4/5] object-cover rounded-[3rem] shadow-xl relative z-10"
          />
          <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl z-20 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1,2,3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-[#edf2ec] flex items-center justify-center overflow-hidden">
                  <Star className="w-5 h-5 text-[#6b8e6b] fill-[#6b8e6b]" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-[#2c3e2d]">4.9/5</p>
              <p className="text-xs text-[#5c705c]">Customer Reviews</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <h2 className="font-serif text-4xl lg:text-5xl text-[#2c3e2d] mb-6">Food that feels <span className="italic text-[#6b8e6b]">good.</span></h2>
          <p className="text-[#4a5d4a] text-lg mb-6 leading-relaxed">
            At MoodMeal, we believe that what you eat directly impacts how you feel. Our mission is to bridge the gap between delicious, restaurant-quality meals and optimal mental wellbeing.
          </p>
          <p className="text-[#4a5d4a] text-lg mb-8 leading-relaxed">
            Every ingredient is thoughtfully selected for its nutritional profile and mood-enhancing properties, creating a dining experience that truly nourishes from the inside out.
          </p>
          <ul className="space-y-4">
            {['Sustainably sourced ingredients', 'No refined sugars or artificial additives', 'Mindfully portioned for sustained energy'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[#2c3e2d] font-medium">
                <ShieldCheck className="w-5 h-5 text-[#6b8e6b]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services/Benefits Cards */}
      <section id="benefits" className="py-24 bg-white px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl text-[#2c3e2d] mb-4">Curated for your lifestyle</h2>
            <p className="text-[#5c705c] text-lg max-w-2xl mx-auto">Elevate your daily routine with meals designed to bring joy, energy, and balance to your busy life.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#faf9f6] rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden">
                <img src="/images/card-smoothie.png" alt="Smoothie bowl" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-[#2c3e2d] mb-3">Morning Vitality</h3>
                <p className="text-[#5c705c] mb-6">Start your day with antioxidant-rich bowls and fresh juices that provide clean, sustained energy.</p>
                <a href="#" className="inline-flex items-center gap-2 text-[#6b8e6b] font-medium hover:text-[#2c3e2d] transition-colors">
                  Explore Breakfast <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-[#faf9f6] rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group translate-y-0 md:translate-y-8">
              <div className="h-64 overflow-hidden">
                <img src="/images/card-salad.png" alt="Mediterranean salad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-[#2c3e2d] mb-3">Midday Focus</h3>
                <p className="text-[#5c705c] mb-6">Crisp, refreshing salads and bowls packed with omega-3s and brain-boosting nutrients for peak productivity.</p>
                <a href="#" className="inline-flex items-center gap-2 text-[#6b8e6b] font-medium hover:text-[#2c3e2d] transition-colors">
                  Explore Lunch <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-[#faf9f6] rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden">
                <img src="/images/card-pancakes.png" alt="Healthy pancakes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-[#2c3e2d] mb-3">Evening Unwind</h3>
                <p className="text-[#5c705c] mb-6">Comforting, wholesome dinners that satisfy cravings while promoting restful sleep and recovery.</p>
                <a href="#" className="inline-flex items-center gap-2 text-[#6b8e6b] font-medium hover:text-[#2c3e2d] transition-colors">
                  Explore Dinner <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2c3e2d] z-0"></div>
        {/* Subtle curved top divider if needed, simulated with rounded box */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] mix-blend-overlay"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Leaf className="w-12 h-12 text-[#6b8e6b] mx-auto mb-8" />
          <h2 className="font-serif text-4xl lg:text-6xl text-white mb-6">Ready to transform your relationship with food?</h2>
          <p className="text-[#a3bfa3] text-lg mb-10 max-w-2xl mx-auto">Join thousands of others who have discovered the power of mood-boosting, chef-prepared meals.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 rounded-full bg-white text-[#2c3e2d] text-lg font-medium hover:bg-[#f0f0f0] transition-all shadow-lg w-full sm:w-auto">
              Create an Account
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-full bg-transparent border-2 border-[#6b8e6b] text-white text-lg font-medium hover:bg-[#6b8e6b]/20 transition-all w-full sm:w-auto">
              Log in
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#3a523b] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-20 -right-20 w-72 h-72 bg-[#1a261b] rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a261b] text-white/70 py-12 px-8 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#6b8e6b]" />
            <span className="font-serif text-xl font-bold text-white">MoodMeal</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
          <p>© 2026 MoodMeal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
