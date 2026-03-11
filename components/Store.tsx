
import React, { useState, useRef, useMemo } from 'react';
import { StoreItem, CartItem, UserProfile } from '../types';
import { STORE_ITEMS, COLORS } from '../constants';
import { 
  ShoppingBag, Star, Plus, Minus, Package, ChevronRight, Filter, X, 
  ShieldCheck, Heart, Sparkles, ArrowRight, CreditCard, Smartphone, 
  Landmark, CheckCircle2, ChevronLeft, Info, Users, Award, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../translations';

interface MomKartProps { profile: UserProfile; }

const MomKart: React.FC<MomKartProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'nb'>('upi');
  const [activeCategory, setActiveCategory] = useState<string>('Postpartum Recovery');
  const [searchQuery, setSearchQuery] = useState('');
  
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
  const taxRate = 0.09;
  const sgst = Math.round(cartSubtotal * taxRate);
  const cgst = Math.round(cartSubtotal * taxRate);
  const deliveryCharge = expressDelivery ? 49 : 0;
  const total = cartSubtotal + sgst + cgst + deliveryCharge;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const options = {
      key: "rzp_test_your_key_here",
      amount: total * 100,
      currency: "INR",
      name: "AfterMa Store",
      description: "Maternal Care Essentials",
      image: "https://picsum.photos/200",
      handler: function (response: any) {
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        setCart([]);
        setShowCart(false);
      },
      prefill: {
        name: profile.name,
        email: "mom@example.com",
        contact: profile.caregiver.contact || "9999999999",
      },
      theme: { color: theme.primary },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Curated Recommendations based on profile
  const recommendedItems = useMemo(() => {
    // Logic to prioritize items based on stage
    if (profile.maternityStage === 'Postpartum') {
      return STORE_ITEMS.filter(item => 
        item.category === 'Postpartum Recovery' || 
        item.category === 'Lactation Support' ||
        item.rating >= 4.8
      ).slice(0, 8);
    }
    return STORE_ITEMS.filter(item => 
      item.category === 'Comfort Care' || 
      item.category === 'Nutrition' ||
      item.rating >= 4.8
    ).slice(0, 8);
  }, [profile.maternityStage]);

  const categories = [
    'Postpartum Recovery', 
    'Lactation Support', 
    'Nutrition', 
    'Baby Essentials', 
    'Comfort Care', 
    'Wellness Tools'
  ];

  const filteredItems = useMemo(() => {
    let items = STORE_ITEMS.filter(item => item.category === activeCategory);
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return items;
  }, [activeCategory, searchQuery]);

  return (
    <div className="animate-in w-full -mt-4 lg:-mt-8 pb-32 relative">
      {/* Floating Basket Anchor */}
      <button 
        onClick={() => setShowCart(true)}
        className="fixed bottom-10 right-10 z-[55] h-16 w-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all lg:hidden"
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">{cart.length}</span>}
      </button>

      {/* Header / Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-[64px] lg:top-[80px] z-[45] shadow-sm -mx-4 lg:-mx-8 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">MomKart</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trust-Based Discovery</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-full px-4 py-2 w-64">
            <Filter size={14} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search essentials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs text-slate-600 w-full"
            />
          </div>
          <button onClick={() => setShowCart(true)} className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-600 text-white transition-all text-[11px] font-bold active:scale-95 group shadow-xl">
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">My Basket</span>
            <div className="bg-white/20 w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold">{cart.length}</div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 mt-10 px-4 lg:px-8">
        {/* Hero Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-[#FFF9F5] border border-[#F3E5D8] p-10 lg:p-16">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white/50 rounded-xl border border-[#F3E5D8]">
              <Sparkles size={14} className="text-[#8B5E3C]" />
              <span className="text-[9px] font-bold uppercase text-[#8B5E3C] tracking-[0.2em]">Curated Recommendations</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-[#5D4037] tracking-tight leading-[1.1]">
              Recommended <br />
              <span className="text-[#8B5E3C]">For You, Mama.</span>
            </h2>
            <p className="text-[#A1887F] text-sm lg:text-lg font-medium max-w-lg leading-relaxed italic">
              "Hand-picked clinical grade products to support your {profile.maternityStage} journey."
            </p>
          </div>
          <div className="absolute right-[-5%] top-[-10%] h-[120%] w-1/2 opacity-[0.05] pointer-events-none flex items-center justify-center">
            <Heart size={600} className="text-[#8B5E3C] -rotate-12" />
          </div>
        </div>

        {/* Recommended Section */}
        <ProductBand 
          title="Recommended for Mothers" 
          subtitle="Based on your maternal needs, expert suggestions, and community feedback."
          items={recommendedItems} 
          addToCart={addToCart}
          icon={<Award size={20} className="text-amber-500" />}
        />

        {/* Store Browsing Layer */}
        <div className="space-y-10 pt-10 border-t border-slate-100">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explore the Store</h3>
            <p className="text-sm text-slate-400 font-medium">Organized by your specific needs and wellness goals.</p>
          </div>

          {/* Category Tabs - Horizontal Sliding */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:-mx-0 lg:px-0">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-[11px] font-bold transition-all duration-300 active:scale-95 border ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                    : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Focused Product Row */}
          <ProductFocusRow 
            items={filteredItems} 
            addToCart={addToCart} 
          />
        </div>
      </div>

      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col lg:rounded-l-[3rem] overflow-hidden"
            >
              <div className="p-8 flex justify-between items-center border-b border-slate-50">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 shadow-inner"><ShoppingBag size={20} /></div>
                   <div className="space-y-0.5"><h3 className="text-xl font-bold text-slate-900 tracking-tight">Healing Cart</h3><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{cart.length} verified items</p></div>
                </div>
                <button onClick={() => setShowCart(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <ShoppingBag size={48} className="text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">Your basket is waiting to be filled <br /> with sisterly recommendations.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-3xl bg-white border border-slate-50 shadow-sm group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0"><img src={item.image} className="w-full h-full object-cover" alt={item.name} /></div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                           <h4 className="font-bold text-slate-900 text-[13px] line-clamp-1">{item.name}</h4>
                           <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-400 transition-colors"><X size={14} /></button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">₹{item.price}</span>
                          <div className="flex items-center gap-3 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-300"><Minus size={12} strokeWidth={3} /></button>
                            <span className="text-[11px] font-bold min-w-[14px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-300"><Plus size={12} strokeWidth={3} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-slate-50 bg-slate-50/30 space-y-8 rounded-t-[3rem]">
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold text-slate-400"><span>Subtotal</span><span className="text-slate-900">₹{cartSubtotal}</span></div>
                    <div className="flex justify-between text-xs font-bold text-slate-400"><span>GST (18%)</span><span className="text-slate-900">₹{sgst + cgst}</span></div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-3"><span>Express Delivery</span><button onClick={() => setExpressDelivery(!expressDelivery)} className={`w-9 h-5 rounded-full relative transition-all duration-300 ${expressDelivery ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${expressDelivery ? 'left-4.5' : 'left-0.5'}`} /></button></div>
                      <span className={expressDelivery ? 'text-slate-900' : 'text-emerald-500'}>{expressDelivery ? '+₹49' : 'FREE'}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-slate-900 pt-4 border-t border-slate-100 tracking-tight"><span>Total</span><span>₹{total}</span></div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Payment Method</p>
                     <div className="grid grid-cols-3 gap-3">
                        <PaymentTab active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} icon={<Smartphone size={16} />} label="UPI" />
                        <PaymentTab active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon={<CreditCard size={16} />} label="Card" />
                        <PaymentTab active={paymentMethod === 'nb'} onClick={() => setPaymentMethod('nb')} icon={<Landmark size={16} />} label="NetBank" />
                     </div>
                  </div>

                  <button 
                    className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-bold text-sm shadow-2xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    onClick={handleCheckout}
                  >
                    Confirm Order <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductFocusRow = ({ items, addToCart }: { items: StoreItem[], addToCart: (item: StoreItem) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = 320 + 24; // width + gap
      const index = Math.round(scrollLeft / itemWidth);
      setFocusedIndex(index);
    }
  };

  return (
    <div className="relative group/row">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-10 -mx-4 px-4 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
      >
        {items.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
            <Package size={48} />
            <p className="text-sm font-bold uppercase tracking-widest">No essentials found</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="snap-center">
              <ProductCard 
                item={item} 
                addToCart={addToCart} 
                isFocused={index === focusedIndex}
              />
            </div>
          ))
        )}
      </div>
      
      {/* Navigation Arrows */}
      {items.length > 0 && (
        <>
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: -344, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-white rounded-full shadow-xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all opacity-0 group-hover/row:opacity-100 hidden lg:block"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: 344, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-white rounded-full shadow-xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all opacity-0 group-hover/row:opacity-100 hidden lg:block"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
};

const ProductBand = ({ title, subtitle, items, addToCart, icon }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              {icon}
            </div>
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
          </div>
          <p className="text-sm text-slate-400 font-medium italic max-w-xl">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')} className="p-3 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm"><ChevronLeft size={20} /></button>
          <button onClick={() => scroll('right')} className="p-3 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 -mx-4 px-4 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
      >
        {items.map((item: StoreItem) => (
          <ProductCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ 
  item: StoreItem, 
  addToCart: (item: StoreItem) => void,
  isFocused?: boolean 
}> = ({ item, addToCart, isFocused = true }) => {
  return (
    <motion.div 
      animate={{ 
        scale: isFocused ? 1 : 0.95,
        opacity: isFocused ? 1 : 0.7
      }}
      whileHover={{ y: -8, scale: 1, opacity: 1 }}
      className="min-w-[280px] md:min-w-[320px] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_25px_60px_rgba(0,0,0,0.04)] transition-all duration-500 group flex flex-col h-full overflow-hidden relative snap-start"
    >
      <div className="relative aspect-[4/5] bg-slate-50/30 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
        
        {/* Trust Badge */}
        {item.trustMarker && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white/40 z-20">
            {item.trustMarker === 'Verified by AfterMa' && <ShieldCheck size={12} className="text-emerald-500" />}
            {item.trustMarker === 'Sister Approved' && <Users size={12} className="text-indigo-500" />}
            {item.trustMarker === 'Local Women-Made' && <Heart size={12} className="text-rose-500" />}
            {item.trustMarker === 'Recommended by Experts' && <Award size={12} className="text-amber-500" />}
            <span className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">{item.trustMarker}</span>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/40 z-20">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-bold text-slate-800">{item.rating}</span>
        </div>
        
        {/* Animated Hover Description */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-10">
           <div className="p-3 bg-white/10 rounded-2xl mb-4"><Sparkles size={24} className="text-emerald-400" /></div>
           <p className="text-white text-xs font-medium leading-relaxed italic">"{item.description}"</p>
           <div className="mt-6 flex items-center gap-2 text-[8px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-400/30 px-3 py-1.5 rounded-full">
              <ShieldCheck size={12} /> Clinical Grade Verified
           </div>
        </div>
      </div>

      <div className="p-7 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <p className="text-[8px] font-bold uppercase text-slate-300 tracking-[0.2em]">{item.brand}</p>
            <span className="text-[7px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-100">{item.category}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug h-9 line-clamp-2">{item.name}</h3>
        </div>
        
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[9px] text-slate-400 font-medium italic leading-tight">
            "A helpful suggestion from our community for your healing journey."
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
          <span className="text-xl font-bold text-slate-900 tracking-tight">₹{item.price}</span>
          <button 
            onClick={() => addToCart(item)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl hover:brightness-105 active:scale-95 transition-all"
          >
            <Plus size={14} strokeWidth={3} />
            Add to Basket
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${active ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
     {icon}
     <span className="text-[9px] font-bold uppercase">{label}</span>
  </button>
);

export default MomKart;
