
import React, { useState } from 'react';
import { StoreItem, CartItem, UserProfile } from '../types';
import { STORE_ITEMS, COLORS } from '../constants';
import { ShoppingCart, Star, Plus, Minus, Truck, ArrowRight, Package, ShieldCheck, Landmark } from 'lucide-react';
import { translations } from '../translations';

interface MomKartProps {
  profile: UserProfile;
}

const MomKart: React.FC<MomKartProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const theme = COLORS[profile.accent] || COLORS.pink;

  const addToCart = (item: StoreItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-6xl mx-auto animate-in space-y-10 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 lg:p-14 rounded-[3.5rem] border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">
             <Package size={14} /> {t.momkart.official}
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">{t.momkart.title}</h2>
          <p className="text-slate-400 font-medium italic text-lg max-w-xl">{t.momkart.subtitle}</p>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <button 
            onClick={() => setShowCart(!showCart)}
            className="relative px-10 py-5 bg-slate-900 text-white rounded-full font-black flex items-center gap-4 shadow-2xl transition-all active:scale-95 group"
          >
            <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
            {t.momkart.basket} ({cart.length})
            {cart.length > 0 && <span className="absolute -top-3 -right-3 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-[12px] border-4 border-white shadow-lg animate-bounce">{cart.length}</span>}
          </button>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <ShieldCheck size={12} /> {t.momkart.secure}
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-50/50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {STORE_ITEMS.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-50 p-6 space-y-6 hover:shadow-2xl transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 shadow-inner">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-800 shadow-sm border border-white/50">
                    {item.brand}
                  </div>
                </div>
              </div>
              <div className="space-y-2 px-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0 mt-1">
                    <Star size={14} fill="currentColor" /> {item.rating}
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{item.category}</p>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-5 border-t border-gray-50 mt-4">
              <span className="text-2xl font-black text-gray-900 tracking-tight">₹{item.price}</span>
              <button 
                onClick={() => addToCart(item)}
                className="px-6 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: theme.primary }}
              >
                {t.momkart.addToCart}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-10 lg:p-14 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-1">
                 <h3 className="text-3xl font-black flex items-center gap-3">{t.momkart.basket}</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Safe items for safe healing</p>
              </div>
              <button onClick={() => setShowCart(false)} className="p-3 bg-gray-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><Plus className="rotate-45" size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-4 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="text-center py-32 space-y-6 opacity-30">
                  <ShoppingCart size={80} className="mx-auto" />
                  <p className="font-black text-xl">{t.momkart.resting}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-xl">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm bg-white shrink-0">
                       <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                         <h4 className="font-black text-gray-900 text-base">{item.name}</h4>
                         <button onClick={() => removeFromCart(item.id)} className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Plus className="rotate-45" size={20} /></button>
                      </div>
                      <p className="text-xs font-black uppercase text-pink-500">{item.brand}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-black text-gray-800">₹{item.price}</span>
                        <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                          <button className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={14} /></button>
                          <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                          <button className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-10 border-t border-slate-100 space-y-8">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400 font-bold text-lg uppercase tracking-widest">{t.momkart.basketTotal}</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tight">₹{total}</span>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-emerald-100">
                  <Truck size={18} /> {t.momkart.freeDelivery}
                </div>
                <button 
                  className="w-full py-6 bg-slate-900 text-white rounded-full font-black shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all text-lg"
                  onClick={() => { alert("Finalizing your safe order... Transferring to secure gateway."); setShowCart(false); }}
                >
                  {t.momkart.confirm} <ArrowRight size={24} />
                </button>
                <div className="flex justify-center gap-6 opacity-30 grayscale pointer-events-none">
                   <Landmark size={24} />
                   <Package size={24} />
                   <ShieldCheck size={24} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MomKart;
