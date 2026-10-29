import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { QRCodeModal } from './components/QRCodeModal';
import { CustomerMenuPage } from './pages/CustomerMenuPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { KitchenKDSPage } from './pages/KitchenKDSPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const [activeView, setActiveView] = useState('menu'); // menu | track | orders | kitchen | admin
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleOrderPlaced = (order) => {
    setPlacedOrder(order);
  };

  const handleTrackOrder = (order) => {
    setTrackingOrderId(order.id);
    setActiveView('track');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'menu' && (
          <CustomerMenuPage onTrackOrder={handleTrackOrder} />
        )}

        {activeView === 'track' && (
          <OrderTrackingPage
            orderId={trackingOrderId}
            onBackToMenu={() => setActiveView('menu')}
          />
        )}

        {activeView === 'orders' && (
          <OrderHistoryPage
            onSelectOrder={handleTrackOrder}
            onBackToMenu={() => setActiveView('menu')}
          />
        )}

        {activeView === 'kitchen' && (
          <KitchenKDSPage />
        )}

        {activeView === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer onOrderPlaced={handleOrderPlaced} />

      {/* Order Placed QR Modal */}
      {placedOrder && (
        <QRCodeModal
          order={placedOrder}
          onClose={() => setPlacedOrder(null)}
          onTrackOrder={(ord) => {
            setPlacedOrder(null);
            handleTrackOrder(ord);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Smart Canteen Ordering & Management System</strong> • Built with Spring Boot 3 & React
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Embedded H2 Database</span>
            <span>•</span>
            <span>Real-Time WebSocket Ready</span>
            <span>•</span>
            <span>Touchless QR Handover</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
