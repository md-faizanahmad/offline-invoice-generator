import { motion } from "framer-motion";
import { INVOICE_PRESETS } from "../../config/invoicePresets";
import type { InvoicePresetKey } from "../../config/invoicePresets";

type Props = {
  value: InvoicePresetKey;
  onChange: (key: InvoicePresetKey) => void;
};

export default function PresetSelector({ value, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl  border border-sky-200/50 bg-linear-to-br from-sky-50 to-white p-5 shadow-sm"
    >
      <div className="mb-3">
        <h2 className="text-base font-semibold text-sky-900">Invoice Type</h2>
        <p className="mt-0.5 text-xs text-sky-600">Select tax structure</p>
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as InvoicePresetKey)}
          className="w-full appearance-none rounded-xl border border-sky-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 hover:border-sky-300 transition"
        >
          {INVOICE_PRESETS.map((preset) => (
            <option key={preset.key} value={preset.key}>
              {preset.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sky-400">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-sky-50/70 px-3 py-2 text-xs text-sky-700">
        Tax rules & fields update automatically
      </div>
    </motion.div>
  );
}
