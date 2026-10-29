import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, X, Clock, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QRCodeModal = ({ order, onClose, onTrackOrder }) => {
  if (!order) return null;

  useEffect(() => {
    // Fire celebratory confetti on order placement!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#e11d48', '#10b981', '#fbbf24']
      });
    } catch (e) {
      // ignore
    }
  }, [order]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900">Order Placed!</h3>
        <p className="text-xs text-slate-500 mt-1">
          Your order has been sent straight to the canteen kitchen.
        </p>

        {/* Big Token Badge */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/80">
          <span className="text-[11px] font-bold text-orange-600 tracking-wider uppercase">
            Your Digital Pickup Token
          </span>
          <div className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            {order.tokenNumber}
          </div>

          {/* QR Code SVG */}
          <div className="mt-4 p-3 bg-white rounded-xl shadow-xs inline-block border border-orange-100">
            <QRCodeSVG
              value={JSON.stringify({
                token: order.tokenNumber,
                orderId: order.id,
                amount: order.totalAmount,
              })}
              size={140}
              level="M"
              includeMargin={false}
            />
          </div>

          <div className="mt-3 text-[11px] font-medium text-slate-500">
            Show this QR or mention token at the collection counter
          </div>
        </div>

        {/* Summary Info */}
        <div className="bg-slate-50 rounded-xl p-3 text-xs text-left mb-5 space-y-1.5 border border-slate-100">
          <div className="flex justify-between text-slate-600">
            <span>Amount Paid</span>
            <span className="font-bold text-slate-900">₹{order.totalAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Method</span>
            <span className="font-semibold text-slate-800 uppercase">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Estimated Prep Time</span>
            <span className="font-bold text-orange-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~8-12 mins
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            if (onTrackOrder) onTrackOrder(order);
          }}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Track Live Status</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
