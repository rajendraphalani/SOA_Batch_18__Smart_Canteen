import React, { useState } from 'react';
import { UtensilsCrossed, ShoppingBag, Wallet, ChefHat, LayoutDashboard, UserCircle, LogOut, Sparkles, Plus, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

export const Navbar = ({ activeView, setActiveView }) => {
  const { user, logout, switchDemoUser, topUpWallet } = useAuth();
  const { totalCount, totalAmount, setIsDrawerOpen } = useCart();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('1000');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpSuccessMsg, setTopUpSuccessMsg] = useState('');

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (!amt || amt <= 0) return;
    setTopUpLoading(true);
    const res = await topUpWallet(amt);
    setTopUpLoading(false);
    if (res.success) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
      setTopUpSuccessMsg(`Successfully added ₹${amt.toFixed(2)} to your wallet!`);
      setTimeout(() => {
        setTopUpSuccessMsg('');
        setShowTopUpModal(false);
      }, 1500);
    } else {
      alert(res.error || 'Failed to top up wallet');
    }
  };

  const handleRoleSwitch = async (role) => {
    if (role === 'ROLE_CUSTOMER') {
      await switchDemoUser('student@canteen.com', 'password123');
      setActiveView('menu');
    } else if (role === 'ROLE_STAFF') {
      await switchDemoUser('staff@canteen.com', 'password123');
      setActiveView('kitchen');
    } else if (role === 'ROLE_ADMIN') {
      await switchDemoUser('admin@canteen.com', 'password123');
      setActiveView('admin');
    }
  };

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('menu')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                SmartCanteen
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                Live System
              </span>
            </div>
          </div>

          {/* Quick Demo Role Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => handleRoleSwitch('ROLE_CUSTOMER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                user?.role === 'ROLE_CUSTOMER' && activeView !== 'kitchen' && activeView !== 'admin'
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('ROLE_STAFF')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                user?.role === 'ROLE_STAFF' || activeView === 'kitchen'
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Kitchen (KDS)</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('ROLE_ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                user?.role === 'ROLE_ADMIN' || activeView === 'admin'
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* User Controls & Cart */}
          <div className="flex items-center gap-3">
            
            {/* Customer Wallet Pill & Top Up Button */}
            {user?.role === 'ROLE_CUSTOMER' && (
              <button
                onClick={() => setShowTopUpModal(true)}
                title="Click to Add Money to Wallet"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-emerald-800 font-semibold text-xs shadow-xs transition-all active:scale-95 group"
              >
                <Wallet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Wallet: ₹{user.walletBalance?.toFixed(2) || '0.00'}</span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ml-1">
                  <Plus className="w-2.5 h-2.5" /> Add
                </span>
              </button>
            )}

            {/* Navigation links */}
            {user?.role === 'ROLE_CUSTOMER' && (
              <button
                onClick={() => setActiveView('orders')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeView === 'orders'
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Orders
              </button>
            )}

            {/* Cart Trigger */}
            {user?.role === 'ROLE_CUSTOMER' && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">₹{totalAmount.toFixed(0)}</span>
                {totalCount > 0 && (
                  <span className="bg-white text-orange-600 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {totalCount}
                  </span>
                )}
              </button>
            )}

            {/* Current user badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {user?.name || 'Guest User'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {user?.role?.replace('ROLE_', '') || 'CUSTOMER'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>

    {/* Top Up Wallet Modal */}
    {showTopUpModal && (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
          
          <button
            onClick={() => setShowTopUpModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs mb-3">
            <Wallet className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">Top Up Canteen Wallet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Add balance instantly for quick, zero-contact meals.
          </p>

          <div className="my-4 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Current Balance:</span>
            <span className="text-lg font-black text-emerald-700">₹{user?.walletBalance?.toFixed(2) || '0.00'}</span>
          </div>

          {topUpSuccessMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{topUpSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleTopUpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 text-left uppercase tracking-wider mb-2">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['100', '200', '500', '1000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      topUpAmount === amt
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 text-left uppercase tracking-wider mb-1">
                Or Enter Custom Amount (₹)
              </label>
              <input
                type="number"
                min="1"
                step="10"
                required
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount (e.g. 1000)"
                className="w-full text-center text-xl font-black py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={topUpLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-60"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{topUpLoading ? 'Processing...' : `Add ₹${topUpAmount || '0'} to Wallet`}</span>
            </button>
          </form>

        </div>
      </div>
    )}
    </>
  );
};
