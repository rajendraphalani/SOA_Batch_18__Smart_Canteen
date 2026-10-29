import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, ShoppingBag, Receipt, CheckCircle, AlertCircle } from 'lucide-react';
import { orderApi } from '../services/api';

export const OrderHistoryPage = ({ onSelectOrder, onBackToMenu }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load past orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold text-[11px]">Placed</span>;
      case 'PREPARING':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold text-[11px]">Preparing</span>;
      case 'READY_FOR_PICKUP':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold text-[11px]">Ready for Pickup</span>;
      case 'COLLECTED':
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold text-[11px]">Collected</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full font-bold text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Your Order History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Keep track of your meals and pickup tokens</p>
        </div>
        <button
          onClick={onBackToMenu}
          className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 shadow-2xs transition-colors"
        >
          Back to Menu
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse h-24" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No previous orders found</h3>
          <p className="text-xs text-slate-400 mt-1">When you place an order, it will appear right here.</p>
          <button
            onClick={onBackToMenu}
            className="mt-4 px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-700"
          >
            Order Food Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-orange-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-base text-slate-900">
                    {order.tokenNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>{order.items?.length || 0} item(s)</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
                </div>

                <div className="text-xs text-slate-600 font-medium pt-1">
                  {order.items?.map((it) => `${it.quantity}x ${it.menuItem?.name}`).join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Total Amount</div>
                  <div className="text-base font-black text-slate-900">₹{order.totalAmount?.toFixed(2)}</div>
                </div>

                <button
                  onClick={() => onSelectOrder(order)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
