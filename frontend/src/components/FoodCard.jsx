import React from 'react';
import { Clock, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ item }) => {
  const { cartItems, addItem, removeItem } = useCart();
  const cartEntry = cartItems.find((ci) => ci.item.id === item.id);
  const countInCart = cartEntry ? cartEntry.quantity : 0;

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${
      !item.isAvailable
        ? 'opacity-60 border-slate-200'
        : 'border-slate-200/80 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5'
    }`}>
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-xs flex items-center gap-1.5">
          <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[2px] ${
            item.isVeg ? 'border-emerald-600' : 'border-rose-600'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
            }`} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Prep Time */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{item.prepTimeMinutes || 10}m</span>
        </div>

        {/* Out of stock overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-extrabold text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.description || "Prepared fresh with hygienic canteen ingredients."}
          </p>
        </div>

        {/* Price & Add Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <div className="text-lg font-extrabold text-slate-900">
              ₹{item.price?.toFixed(0)}
            </div>
          </div>

          {item.isAvailable ? (
            countInCart > 0 ? (
              <div className="flex items-center bg-orange-50 border border-orange-200 rounded-xl p-0.5">
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-orange-600 font-bold hover:bg-orange-100 transition-colors shadow-2xs"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-extrabold text-orange-700">
                  {countInCart}
                </span>
                <button
                  onClick={() => addItem(item)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-2xs"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(item)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white font-bold text-xs transition-all duration-200 border border-orange-200 hover:border-transparent active:scale-95 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )
          ) : (
            <span className="text-xs font-semibold text-slate-400 italic">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
