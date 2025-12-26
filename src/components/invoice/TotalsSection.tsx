import { motion } from "framer-motion";
import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import { formatMoney } from "../../utils/formatMoney";
import { QrCode, Calculator } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
};

export default function TotalsSection({ invoice, setInvoice }: Props) {
  const { subtotal, taxAmount, total } = invoice.totals;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl border border-sky-200/50 bg-white/90 shadow-md overflow-hidden backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-sky-100 bg-sky-50/50 px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Calculator className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-sky-900">Totals</h2>
      </div>

      <div className="p-5 space-y-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex justify-between text-slate-700">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium text-slate-800">
              {formatMoney(subtotal, invoice.currency)}
            </span>
          </div>

          {invoice.tax.mode !== "NONE" && (
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">{invoice.tax.label}</span>
              <span className="font-medium text-slate-800">
                {formatMoney(taxAmount ?? 0, invoice.currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between border-t border-sky-200 pt-4">
            <span className="font-semibold text-sky-900 text-lg">
              Grand Total
            </span>
            <span className="font-bold text-xl text-sky-700">
              {formatMoney(total, invoice.currency)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-sky-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={invoice.qrEnabled}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    qrEnabled: e.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-sky-600" />
              <span className="text-sm font-medium text-slate-700">
                Include QR code
              </span>
            </div>
          </label>
          <p className="mt-1 text-xs text-slate-500 italic">
            For payment link or verification
          </p>
        </div>
      </div>
    </motion.div>
  );
}
