import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, CheckCircle2, ChefHat, Bell, Sparkles, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { orderApi } from '../services/api';

export const OrderTrackingPage = ({ orderId, onBackToMenu }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    try {
      setRefreshing(true);
      const res = await orderApi.getOrder(orderId);
      setOrder(res.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Real-time live polling every 3.5s for seamless status synchronization
    const interval = setInterval(fetchOrder, 3500);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading live order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800">Order not found</h3>
        <button
          onClick={onBackToMenu}
          className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', label: 'Order Received', desc: 'Sent to kitchen queue' },
    { key: 'PREPARING', label: 'Chef Preparing', desc: 'Food is being cooked fresh' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'At Counter #1' },
    { key: 'COLLECTED', label: 'Collected', desc: 'Enjoy your meal!' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'PREPARING': return 1;
      case 'READY_FOR_PICKUP': return 2;
      case 'COLLECTED': return 3;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Live Sync</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>

      {/* Hero Status Card */}
      <div className={`p-6 rounded-3xl text-white shadow-xl transition-all duration-500 ${
        order.status === 'READY_FOR_PICKUP'
          ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-600/20 ring-4 ring-emerald-400/30'
          : order.status === 'PREPARING'
          ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-600/20'
          : order.status === 'COLLECTED'
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-900/20'
          : 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white">
              {order.status === 'READY_FOR_PICKUP' ? '⚡ READY FOR COLLECTION' : 'LIVE STATUS'}
            </span>
            <h2 className="text-2xl font-black mt-2">
              {order.status === 'PLACED' && 'Waiting in Kitchen Queue...'}
              {order.status === 'PREPARING' && 'Chef is Cooking Your Meal!'}
              {order.status === 'READY_FOR_PICKUP' && 'Your Order is Hot & Ready!'}
              {order.status === 'COLLECTED' && 'Order Completed!'}
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              {order.status === 'READY_FOR_PICKUP'
                ? 'Please head to Counter #1 with your QR code or token.'
                : 'We will notify you immediately once packaging is done.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center border border-white/20">
            <div className="text-[10px] uppercase font-bold text-white/80">Your Token</div>
            <div className="text-2xl font-black">{order.tokenNumber}</div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/15">
          <div className="grid grid-cols-4 gap-2 text-center">
            {steps.map((step, idx) => {
              const isDone = idx <= currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCurrent
                        ? 'bg-white text-slate-900 shadow-lg scale-110'
                        : isDone
                        ? 'bg-white/90 text-slate-900'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`mt-2 text-[11px] font-bold leading-tight ${
                    isCurrent ? 'text-white' : isDone ? 'text-white/90' : 'text-white/50'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QR Code & Pickup Verification Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-extrabold text-slate-900 text-base">
            Counter Handover Verification
          </h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Kitchen staff will scan this QR code or verify token <strong className="text-slate-800">{order.tokenNumber}</strong> to ensure touchless, accurate collection.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pickup Counter: #1 (Express Tray)</span>
          </div>
        </div>

        {/* QR SVG */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
          <QRCodeSVG
            value={JSON.stringify({
              token: order.tokenNumber,
              orderId: order.id,
            })}
            size={130}
            level="M"
          />
        </div>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h4 className="font-bold text-slate-900 text-sm mb-4">Items in this Order</h4>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-orange-50 text-orange-600 font-bold flex items-center justify-center text-[10px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-slate-800">{item.menuItem?.name}</span>
              </div>
              <span className="font-bold text-slate-900">
                ₹{(item.itemPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            <strong className="text-slate-800">Special Notes:</strong> {order.notes}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Total Paid via {order.paymentMethod}</span>
          <span className="text-base font-black text-slate-900">₹{order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
};
