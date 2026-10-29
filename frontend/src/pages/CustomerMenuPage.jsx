import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, ChefHat, ArrowRight, AlertCircle } from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { menuApi, orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CustomerMenuPage = ({ onTrackOrder }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('ALL'); // ALL, VEG, NON_VEG
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    fetchMenuData();
    checkActiveOrder();
  }, [user]);

  const fetchMenuData = async () => {
    try {
      const [catRes, itemRes] = await Promise.all([
        menuApi.getCategories(),
        menuApi.getAllItems()
      ]);
      setCategories(catRes.data);
      setMenuItems(itemRes.data);
    } catch (err) {
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkActiveOrder = async () => {
    if (!user) return;
    try {
      const res = await orderApi.getMyOrders();
      const latest = res.data.find(
        (o) => o.status === 'PLACED' || o.status === 'PREPARING' || o.status === 'READY_FOR_PICKUP'
      );
      setActiveOrder(latest || null);
    } catch (e) {
      // ignore
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category?.id === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiet =
      vegFilter === 'ALL' ||
      (vegFilter === 'VEG' && item.isVeg) ||
      (vegFilter === 'NON_VEG' && !item.isVeg);

    return matchesCategory && matchesSearch && matchesDiet;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Active Order Banner (If user has an order currently in progress) */}
      {activeOrder && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
              {activeOrder.tokenNumber}
            </div>
            <div>
              <div className="text-xs font-semibold text-orange-100 uppercase tracking-wider">
                Active Order In Progress
              </div>
              <div className="text-sm font-extrabold flex items-center gap-2">
                <span>Status:</span>
                <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {activeOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onTrackOrder(activeOrder)}
            className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors shadow-xs flex items-center gap-1.5 self-end sm:self-auto"
          >
            <span>Live Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart College Canteen & Cafeteria</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Skip the Queue, Enjoy Fresh Meals Faster!
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Order your favorite dishes online, receive a digital pickup token & QR code, and collect hassle-free from the counter.
          </p>
        </div>
      </div>

      {/* Controls: Search Bar & Diet Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes (e.g., Dosa, Biryani, Chai, Burger)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-xs"
          />
        </div>

        {/* Veg / Non-Veg Filters */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setVegFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              vegFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setVegFilter('VEG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              vegFilter === 'VEG'
                ? 'bg-white text-emerald-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Veg Only</span>
          </button>
          <button
            onClick={() => setVegFilter('NON_VEG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              vegFilter === 'NON_VEG'
                ? 'bg-white text-rose-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-rose-600" />
            <span>Non-Veg</span>
          </button>
        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-3">
              <div className="aspect-video bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No dishes match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
};
