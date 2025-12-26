import { motion } from "framer-motion";
import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import { CURRENCIES } from "../../config/currencies";
import { CURRENCY_SYMBOLS } from "../../utils/currencySymbols";
import { ReceiptText } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
};

export default function InvoiceHeader({ invoice, setInvoice }: Props) {
  const currency = invoice.currency;
  const symbol = CURRENCY_SYMBOLS[currency.code];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-sky-200/50 bg-linear-to-br from-sky-50 to-white shadow-sm"
    >
      {/* Accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-400 to-sky-600" />

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100/80 text-sky-600 shadow-sm"
          >
            <ReceiptText className="h-5 w-5" />
          </motion.div>

          <div>
            <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
              {invoice.tax.mode === "NONE"
                ? "Invoice"
                : `${invoice.tax.label} Invoice`}
            </h1>
          </div>
        </div>

        {/* Right - Currency */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-white text-lg font-bold text-sky-700 shadow-sm">
            {symbol}
          </div>

          <select
            value={currency.code}
            onChange={(e) => {
              const selected = CURRENCIES.find(
                (c) => c.code === e.target.value
              );
              if (!selected) return;
              setInvoice((prev) => ({ ...prev, currency: selected }));
            }}
            className="h-10 w-full max-w-35 rounded-lg border border-sky-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 hover:border-sky-300 transition"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {CURRENCY_SYMBOLS[c.code]}
              </option>
            ))}
          </select>
        </motion.div>
      </div>
      <div className="mt-3 mb-4 rounded-lg bg-sky-50/70 px-3 py-2 text-xs text-sky-700">
        Offline • Private • PDF Ready
      </div>
    </motion.div>
  );
}
