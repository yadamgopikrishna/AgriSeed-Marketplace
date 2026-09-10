import React from 'react';
import { X, Printer, ShieldCheck, Download, Award, QrCode } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  const { t, getLocalizedProductName } = useLanguage();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id || order.orderId || 'AGRI-849201'}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col justify-between print:m-0 print:p-0 print:border-none print:shadow-none">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-slate-900 text-sm">{t('invoiceModalTitle')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('invoiceDownloadPdf')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-10 space-y-6 text-xs text-slate-800 bg-white" id="printable-invoice">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-emerald-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-serif text-emerald-950">AgriSeed Direct</span>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded">
                  ICAR Certified Lots
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">National Agricultural Seed & Fertilizer Marketplace</p>
              <p className="text-slate-500 text-[11px]">GSTIN: <strong>07AAACA1234F1Z8</strong> • License: <strong>DL-AGR-2023-8821</strong></p>
            </div>

            <div className="text-left sm:text-right">
              <strong className="text-sm font-black text-slate-900 block">{t('invoiceTaxInvoice')}</strong>
              <p className="font-mono text-emerald-800 font-bold mt-0.5">{invoiceNumber}</p>
              <p className="text-slate-500">Date: <strong>{currentDate}</strong></p>
              <p className="text-slate-500">Payment: <strong>{order.paymentMethod || 'UPI / Online'}</strong></p>
            </div>
          </div>

          {/* Customer & Consignment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t('invoiceBilledTo')}
              </span>
              <strong className="text-sm font-extrabold text-slate-900 block">
                {order.deliveryAddress?.fullName || order.userName || 'Ramesh Kumar Singh'}
              </strong>
              <p className="text-slate-600 mt-0.5">
                Village: {order.deliveryAddress?.village || 'Rampur Khurd'}, {order.deliveryAddress?.district || 'Karnal'}
              </p>
              <p className="text-slate-600">
                State: {order.deliveryAddress?.state || 'Haryana'} - {order.deliveryAddress?.pincode || '132114'}
              </p>
              <p className="text-slate-600">Phone: {order.deliveryAddress?.phone || '+91 98765 43210'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t('invoiceConsignmentDetails')}
              </span>
              <p className="text-slate-600">Order ID: <strong>#{order.id || order.orderId}</strong></p>
              <p className="text-slate-600">Carrier: <strong>{order.courierPartner || 'AgriExpress Rural Fleet'}</strong></p>
              <p className="text-slate-600">AWB Tracking: <code className="font-mono font-bold text-emerald-800">{order.trackingAwb || 'AWB-AGRI-849201-DL'}</code></p>
              <p className="text-slate-600">Fulfillment Status: <strong className="text-emerald-700 uppercase">{order.status || 'Confirmed'}</strong></p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-950 text-white font-bold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Agricultural Item / Certified Seed Lot</th>
                  <th className="p-3">Pack Unit</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price (₹)</th>
                  <th className="p-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">
                      {getLocalizedProductName(item)}
                      <span className="block text-[10px] text-emerald-700 font-semibold">ICAR Tested Germination: 92%+</span>
                    </td>
                    <td className="p-3 text-slate-600">{item.packSize || item.unit}</td>
                    <td className="p-3 text-center font-bold text-slate-900">{item.quantity}</td>
                    <td className="p-3 text-right text-slate-600">₹{item.price}</td>
                    <td className="p-3 text-right font-black text-slate-900">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary & QR Seal */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
            
            {/* Left: QR Code & ICAR Seal */}
            <div className="sm:col-span-7 flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div>
                <strong className="text-[11px] font-black text-emerald-950 block uppercase tracking-wide">
                  {t('invoiceCertifiedLotSeal')}
                </strong>
                <p className="text-[10px] text-emerald-800 mt-0.5 leading-snug">
                  {t('invoiceQrNotice')}
                </p>
                <span className="text-[9px] text-slate-400 block mt-1">Verification Hash: SHA256-AGRI-LOT-9921</span>
              </div>
            </div>

            {/* Right: Calculations */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Kisan Subsidy Discount:</span>
                  <span>- ₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (0% Exempt for Certified Seeds):</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Rural Delivery Fee:</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t-2 border-slate-900 text-sm font-black text-slate-950">
                <span>Grand Total Paid:</span>
                <span className="text-base text-emerald-950">₹{order.totalAmount}</span>
              </div>
            </div>

          </div>

          {/* Footer Declaration */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center leading-relaxed">
            This is a computer-generated tax invoice and ICAR seed certification record. No signature required.
            All agricultural inputs supplied through AgriSeed Direct carry authentic laboratory seed purity guarantees.
          </div>

        </div>

      </div>
    </div>
  );
};
