import React from 'react';
import Layout from '../components/Layout';
import { ShoppingBag, ArrowUpRight, Star } from 'lucide-react';

const Store = () => {
  const storeItems = [
    {
      id: 1,
      name: "Hand-carved Olive Wood Spoon",
      artisan: "Elena Rossi, Italy",
      price: "$24",
      image: "https://images.unsplash.com/photo-1588691512403-f111005ab86e?auto=format&fit=crop&q=80&w=800",
      rating: "4.9"
    },
    {
      id: 2,
      name: "Speckled Ceramic Matcha Bowl",
      artisan: "Kenji Sato, Japan",
      price: "$45",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
      rating: "5.0"
    },
    {
      id: 3,
      name: "Minimalist Stoneware Plate Set",
      artisan: "Studio Nord, Denmark",
      price: "$68",
      image: "https://images.unsplash.com/photo-1611077543956-65103c800cc7?auto=format&fit=crop&q=80&w=800",
      rating: "4.8"
    },
    {
      id: 4,
      name: "Bamboo Chopsticks with Rest",
      artisan: "Mei Lin, Taiwan",
      price: "$18",
      image: "https://images.unsplash.com/photo-1582283995893-b261b0c03cc3?auto=format&fit=crop&q=80&w=800",
      rating: "4.9"
    }
  ];

  return (
    <Layout>
      <div className="p-10 max-w-6xl mx-auto">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-[#6b8e6b] mx-auto mb-6" />
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#2c3e2d] mb-6">Artisan Market</h1>
          <p className="text-lg text-[#5c705c] leading-relaxed">
            Elevate your dining experience with sustainably crafted, beautiful dining ware. We connect you directly with independent artisans around the world.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {storeItems.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#e0e8e0]">
              <div className="h-[300px] overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-[#2c3e2d] flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 text-[#6b8e6b] fill-[#6b8e6b]" /> {item.rating}
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[#6b8e6b] font-medium text-sm mb-1">{item.artisan}</p>
                    <h2 className="font-serif text-2xl font-bold text-[#2c3e2d]">{item.name}</h2>
                  </div>
                  <span className="text-xl font-medium text-[#2c3e2d] bg-[#edf2ec] px-4 py-2 rounded-xl">
                    {item.price}
                  </span>
                </div>
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-transparent border-2 border-[#2c3e2d] text-[#2c3e2d] rounded-2xl font-bold hover:bg-[#2c3e2d] hover:text-white transition-colors group/btn">
                  Connect with Artisan
                  <ArrowUpRight className="w-5 h-5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-[#8ca38c] text-sm">More artisans joining soon. 100% of sales go directly to the creators.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Store;
