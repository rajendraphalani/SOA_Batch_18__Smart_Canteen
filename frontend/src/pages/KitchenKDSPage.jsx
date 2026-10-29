import React, { useState, useEffect } from 'react';
import { ChefHat, CheckCircle2, Clock, Bell, Flame, RefreshCw, QrCode, Search, Check, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { kitchenApi, menuApi } from '../services/api';

export const KitchenKDSPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenMsg, setTokenMsg] = useState({ type: '', text: '' });
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchKitchenOrders = async () => {
    try {
      const res = await kitchenApi.getActiveOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching kitchen orders', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await menuApi.getAllItems();
      setAllItems(res.data);
    } catch (err) {
      console.error('Error fetching menu items', err);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    fetchMenuItems();
    const interval = setInterval(fetchKitchenOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await kitchenApi.updateStatus(orderId, newStatus);
      await fetchKitchenOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    try {
      setTokenMsg({ type: '', text: '' });
      const res = await kitchenApi.verifyToken(tokenInput);
      setTokenMsg({
        type: 'success',
        text: `Success! Order ${res.data.tokenNumber} collected and completed.`
      });
      setTokenInput('');
      await fetchKitchenOrders();
      setTimeout(() => setTokenMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setTokenMsg({
        type: 'error',
        text: err.response?.data?.error || 'Invalid token or order not found.'
      });
    }
  };

  const handleToggleStock = async (itemId) => {
    try {
      await menuApi.toggleItemStock(itemId);
      await fetchMenuItems();
    } catch (err) {
      alert('Failed to toggle stock');
    }
  };

  const placedOrders = orders.filter((o) => o.status === 'PLACED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY_FOR_PICKUP');

  const getTimeElapsed = (dateString) => {
    const diffMs = new Date() - new Date(dateString);
    const mins = Math.floor(diffMs / 60000);
    return mins <= 0 ? 'Just now' : `${mins}m ago`;
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* KDS Header & Quick Verification Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">Kitchen Display System (KDS)</h1>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500">Live order queue for chefs & counter staff</p>
          </div>
        </div>

        {/* Token Verification Quick Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <form onSubmit={handleVerifyToken} className="flex items-center gap-2">
            <div className="relative">
              <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter Token # (e.g. TK-101)..."
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold w-48 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Verify Pickup
            </button>
          </form>

          {/* Quick Menu Stock Modal Button */}
          <button
            onClick={() => setMenuModalOpen(true)}
            className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition-colors"
          >
            Manage Stock
          </button>
        </div>
      </div>

      {/* Token Action Message */}
      {tokenMsg.text && (
        <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          tokenMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {tokenMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{tokenMsg.text}</span>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: New / Placed Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-amber-400">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Incoming Orders</span>
            </div>
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">
              {placedOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {placedOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No new incoming orders
              </div>
            ) : (
              placedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-lg">
                      {order.tokenNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {getTimeElapsed(order.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">
                          <strong className="text-orange-600 mr-1.5">{item.quantity}x</strong>
                          {item.menuItem?.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg text-[11px] text-amber-900 italic">
                      Note: "{order.notes}"
                    </div>
                  )}

                  <button
                    onClick={() => handleStatusChange(order.id, 'PREPARING')}
                    disabled={updatingId === order.id}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Start Preparing</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-blue-500">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <Flame className="w-4 h-4 text-blue-500" />
              <span>In Preparation</span>
            </div>
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No orders being prepared
              </div>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border-2 border-blue-200 p-4 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-lg">
                      {order.tokenNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {getTimeElapsed(order.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">
                          <strong className="text-blue-600 mr-1.5">{item.quantity}x</strong>
                          {item.menuItem?.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-700 italic">
                      Note: "{order.notes}"
                    </div>
                  )}

                  <button
                    onClick={() => handleStatusChange(order.id, 'READY_FOR_PICKUP')}
                    disabled={updatingId === order.id}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Mark Ready for Pickup</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Pickup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Ready for Pickup</span>
            </div>
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No orders waiting at counter
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border-2 border-emerald-300 p-4 shadow-sm hover:shadow-md transition-all space-y-3 bg-emerald-50/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-lg">
                      {order.tokenNumber}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Counter #1
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">
                          <strong className="text-emerald-600 mr-1.5">{item.quantity}x</strong>
                          {item.menuItem?.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStatusChange(order.id, 'COLLECTED')}
                    disabled={updatingId === order.id}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Complete / Handover</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Quick Stock Modal */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Quick Stock Availability</h3>
              <button
                onClick={() => setMenuModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                Done
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 pr-2">
              {allItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-500">₹{item.price}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStock(item.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      item.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
