import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, TrendingUp, Plus, Trash2, Edit3, Image, AlertTriangle } from 'lucide-react';
import { adminApi, menuApi } from '../services/api';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | menu | orders
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Item Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    isVeg: true,
    prepTimeMinutes: 10,
    categoryId: '',
  });

  const fetchData = async () => {
    try {
      const [anRes, ordRes, menuRes, catRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getAllOrders(),
        menuApi.getAllItems(),
        menuApi.getCategories(),
      ]);
      setAnalytics(anRes.data);
      setOrders(ordRes.data);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !newItem.categoryId) {
        setNewItem((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await menuApi.createItem({
        ...newItem,
        price: parseFloat(newItem.price),
        prepTimeMinutes: parseInt(newItem.prepTimeMinutes, 10),
        categoryId: parseInt(newItem.categoryId, 10),
      });
      setShowAddModal(false);
      setNewItem({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        isVeg: true,
        prepTimeMinutes: 10,
        categoryId: categories[0]?.id || '',
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add dish');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to remove this dish from the menu?')) return;
    try {
      await menuApi.deleteItem(id);
      await fetchData();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleToggleStock = async (id) => {
    try {
      await menuApi.toggleItemStock(id);
      await fetchData();
    } catch (err) {
      alert('Failed to toggle stock');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner & Tab Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Canteen Administration</h1>
          <p className="text-xs text-slate-500">Monitor revenue, control live menus, and track kitchen queues</p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics & Reports
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'menu'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menu Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Orders Log ({orders.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Analytics & Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Revenue */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Revenue</div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{analytics?.todayRevenue?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Orders</div>
                <div className="text-2xl font-black text-slate-900">
                  {analytics?.todayOrdersCount || 0}
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Kitchen Queue</div>
                <div className="text-2xl font-black text-slate-900">
                  {analytics?.pendingOrdersCount || 0}
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Orders</div>
                <div className="text-2xl font-black text-slate-900">
                  {analytics?.completedOrdersCount || 0}
                </div>
              </div>
            </div>

          </div>

          {/* Quick Recent Activity preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4">Real-Time Kitchen Queue Preview</h3>
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                      {ord.tokenNumber}
                    </span>
                    <span className="font-semibold text-slate-700">{ord.user?.name || 'Customer'}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{ord.items?.length} items</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">₹{ord.totalAmount?.toFixed(2)}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Menu Management */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900">Live Menu Catalog ({menuItems.length} items)</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-0.5">{item.category?.name}</div>
                      <div className="text-sm font-extrabold text-slate-900 mt-1">₹{item.price}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleStock(item.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                      item.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {item.isAvailable ? '● In Stock' : '○ Out of Stock'}
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: All Orders Log */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base">Complete Order Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-extrabold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-5 py-3">Token #</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items Ordered</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Total Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-black text-slate-900">{ord.tokenNumber}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{ord.user?.name || 'Rahul'}</td>
                    <td className="px-5 py-4">{ord.items?.map((it) => `${it.quantity}x ${it.menuItem?.name}`).join(', ')}</td>
                    <td className="px-5 py-4 font-semibold uppercase">{ord.paymentMethod}</td>
                    <td className="px-5 py-4 font-black text-slate-900">₹{ord.totalAmount?.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Add New Canteen Dish</h3>
            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Paneer Kathi Roll"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newItem.categoryId}
                  onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="80"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={newItem.prepTimeMinutes}
                    onChange={(e) => setNewItem({ ...newItem, prepTimeMinutes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dietary Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700">
                    <input
                      type="radio"
                      name="diet"
                      checked={newItem.isVeg}
                      onChange={() => setNewItem({ ...newItem, isVeg: true })}
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-700">
                    <input
                      type="radio"
                      name="diet"
                      checked={!newItem.isVeg}
                      onChange={() => setNewItem({ ...newItem, isVeg: false })}
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Freshly prepared spiced roll with mint chutney..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
