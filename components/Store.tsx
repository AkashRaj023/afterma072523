
import React, { useState } from 'react';
import { StoreItem, CartItem, UserProfile } from '../types';
import { STORE_ITEMS, COLORS } from '../constants';
import { ShoppingCart, Star, Plus, Minus, Package, ChevronRight, Filter, X } from 'lucide-react';
import { translations } from '../translations';

interface MomKartProps { profile: UserProfile; }

const CATEGORIES = ['All', 'Baby Care', 'Recovery', 'Nutrition', 'Devices'];

const MomKart: React.FC<MomKartProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expressDelivery, setExpressDelivery] = useState(false);
  const theme = COLORS[profile.accent] || COLORS.PINK;

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

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = expressDelivery ? 49 : 0;
  const total = cartSubtotal + deliveryCharge;

  const filteredItems = activeCategory === 'All' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-6 animate-in max-w-7xl mx-auto px-1 md:px-0">
      {/* Category Strip - Sticky & Interactive */}
      <div 
        className="bg-white/90 backdrop-blur-md border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 overflow-x-auto scrollbar-hide flex items-center gap-5 sticky top-[64px] lg:top-[80px] z-[45] shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all"
      >
        <div className="flex items-center gap-2 text-xs font-black text-slate-400 mr-2 shrink-0 uppercase tracking-widest">
          <Filter size={14} /> <span>Filter</span>
        </div>
        <div className="flex items-center gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all border active:scale-95 ${
                activeCategory === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg translate-y-[-1px]' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="ml-auto shrink-0 flex items-center gap-4">
          <button 
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-xs font-black shadow-sm group active:scale-95"
          >
            <ShoppingCart size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">My Basket</span>
            <span 
              className="bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] ml-1 transition-transform group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.text})` }}
            >
              {cart.length}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div 
        className="relative h-40 md:h-56 rounded-[2rem] overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm flex items-center p-8 md:p-14 transition-all hover:shadow-xl group"
      >
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
            MomKart Curated
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight group-hover:translate-x-1 transition-transform">{t.momkart.title}</h2>
          <p className="text-sm text-slate-400 font-medium italic max-w-md">{t.momkart.subtitle}</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
           <Package size={240} className="absolute right-[-40px] top-[-20px] text-slate-300 rotate-12 group-hover:rotate-6 transition-transform" />
        </div>
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" 
          style={{ background: `radial-gradient(circle at center, ${theme.primary}, transparent)` }} 
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-10">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group flex flex-col h-full overflow-hidden relative active:scale-[0.98]">
            <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur shadow-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-transform group-hover:translate-y-[-2px]">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-black text-slate-800">{item.rating}</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.brand}</p>
                <h3 className="text-sm font-black text-slate-800 line-clamp-2 leading-tight h-10 group-hover:text-slate-900 transition-colors">{item.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-1 italic">"{item.description}"</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <span className="text-xl font-black text-slate-900 tracking-tight">₹{item.price}</span>
                  <p className="text-[9px] text-emerald-500 font-black uppercase tracking-tighter">Verified Choice</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="p-3 rounded-2xl text-white transition-all active:scale-90 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
                  style={{ 
                    backgroundColor: theme.primary, 
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.text})` 
                  }}
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[3rem] overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white rounded-2xl shadow-md text-slate-800 animate-bounce-slow">
                   <ShoppingCart size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800">{t.momkart.basket}</h3>
              </div>
              <button onClick={() => setShowCart(false)} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                <X size={28} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4 grayscale">
                  <div className="p-10 bg-slate-50 rounded-full"><Package size={80} className="text-slate-300" /></div>
                  <div className="space-y-1">
                    <p className="font-black text-slate-800 text-lg">Your basket is resting</p>
                    <p className="text-sm text-slate-400 font-medium">Add healing essentials to get started.</p>
                  </div>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-5 p-5 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-50">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.name} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.brand}</p>
                           <h4 className="font-black text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                         </div>
                         <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><X size={18} /></button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-lg tracking-tight">₹{item.price}</span>
                        <div className="flex items-center gap-4 bg-slate-100 px-3 py-1.5 rounded-2xl shadow-inner">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={16} strokeWidth={3} /></button>
                          <span className="text-sm font-black min-w-[16px] text-center text-slate-700">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={16} strokeWidth={3} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-slate-100 bg-slate-50 space-y-8 rounded-t-[3rem] shadow-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-500"><span>Subtotal</span><span>₹{cartSubtotal}</span></div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <div className="flex items-center gap-2"><span className="text-slate-500">Express Delivery</span><button onClick={() => setExpressDelivery(!expressDelivery)} className={`w-10 h-6 rounded-full relative transition-all shadow-inner ${expressDelivery ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${expressDelivery ? 'left-5' : 'left-1'}`} /></button></div>
                    <span className={expressDelivery ? 'text-slate-800' : 'text-emerald-500'}>{expressDelivery ? '+₹49' : 'Free'}</span>
                  </div>
                  <div className="flex justify-between text-3xl font-black text-slate-900 pt-6 border-t border-slate-200 tracking-tighter"><span>Total</span><span>₹{total}</span></div>
                </div>
                <button 
                  className="w-full py-6 text-white rounded-[2rem] font-black flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:brightness-105 active:scale-95 transition-all text-base uppercase tracking-widest"
                  style={{ backgroundColor: theme.primary, background: `linear-gradient(135deg, ${theme.primary}, ${theme.text})` }}
                  onClick={() => { alert(`Secure Checkout for ₹${total}...`); setShowCart(false); }}
                >
                  {t.momkart.confirm} <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MomKart;
