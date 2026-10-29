import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Wallet, Smartphone, Banknote, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';

export const CartDrawer = ({ onOrderPlaced }) => {
  const { cartItems, addItem, removeItem, deleteItem, clearCart, totalAmount, notes, setNotes, isDrawerOpen, setIsDrawerOpen } = useCart();
  const { user, refreshUser } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('WALLET');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isDrawerOpen) return null;

  const handleCheckout = async () => {
    setErrorMsg('');
    if (cartItems.length === 0) return;

    if (paymentMethod === 'WALLET' && user && user.walletBalance < totalAmount) {
      setErrorMsg(`Insufficient wallet balance. You need ₹${totalAmount.toFixed(0)}, but your balance is ₹${user.walletBalance.toFixed(0)}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        items: cartItems.map((ci) => ({
          menuItemId: ci.item.id,
          quantity: ci.quantity,
        })),
        paymentMethod: paymentMethod,
        notes: notes.trim(),
      };

      const res = await orderApi.placeOrder(payload);
      const placedOrder = res.data;

      // Deduct balance locally if paid via wallet
      if (paymentMethod === 'WALLET' && user) {
        refreshUser({
          ...user,
          walletBalance: Math.max(0, user.walletBalance - totalAmount),
        });
      }

      clearCart();
      setIsDrawerOpen(false);
      if (onOrderPlaced) {
        onOrderPlaced(placedOrder);
      }
    } catch (err) {
      console.error('Order error', err);
      setErrorMsg(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">Your Order</h2>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((s, ci) => s + ci.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Browse delicious canteen dishes and add them to your tray.
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {cartItems.map((ci) => (
                    <div
                      key={ci.item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={ci.item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80"}
                          alt={ci.item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-sm text-slate-900 leading-tight">
                            {ci.item.name}
                          </div>
                          <div className="text-xs font-semibold text-slate-500 mt-0.5">
                            ₹{ci.item.price} each
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            onClick={() => removeItem(ci.item.id)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-orange-600 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-extrabold text-slate-800">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => addItem(ci.item)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-orange-600 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => deleteItem(ci.item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cooking Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Less spicy, keep sambar hot, no sugar in tea..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                  />
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    
                    {/* Wallet */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('WALLET')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                        paymentMethod === 'WALLET'
                          ? 'border-orange-500 bg-orange-50/50 text-orange-700 ring-1 ring-orange-500'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Wallet className="w-5 h-5 mb-1 text-emerald-600" />
                      <span className="text-[11px] font-bold">Canteen Wallet</span>
                      <span className="text-[9px] text-slate-500">
                        Bal: ₹{user?.walletBalance?.toFixed(0) || '500'}
                      </span>
                    </button>

                    {/* UPI */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-orange-500 bg-orange-50/50 text-orange-700 ring-1 ring-orange-500'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mb-1 text-blue-600" />
                      <span className="text-[11px] font-bold">UPI / GPay</span>
                      <span className="text-[9px] text-slate-500">Instant</span>
                    </button>

                    {/* Cash at Counter */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                        paymentMethod === 'CASH'
                          ? 'border-orange-500 bg-orange-50/50 text-orange-700 ring-1 ring-orange-500'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Banknote className="w-5 h-5 mb-1 text-amber-600" />
                      <span className="text-[11px] font-bold">Counter Cash</span>
                      <span className="text-[9px] text-slate-500">Pay on Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-800">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Canteen Fee</span>
                    <span className="font-semibold text-emerald-600">₹0.00 (Free)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>Grand Total</span>
                    <span className="text-orange-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{totalAmount.toFixed(0)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
