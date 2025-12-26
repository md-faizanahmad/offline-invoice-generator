import { motion } from "framer-motion";
import type { Invoice, InvoiceItem } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import type { ValidationErrors } from "../../types/validation";
import { Plus, Trash2, Package } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
  errors: ValidationErrors;
};

export default function ItemsSection({ invoice, setInvoice, errors }: Props) {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      name: "",
      qty: 1,
      price: 0,
    };
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border border-sky-200/50 bg-white/90 shadow-md overflow-hidden backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50/50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
            <Package className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-sky-900">Items</h2>
        </div>

        {errors["items"] && (
          <p className="text-xs text-red-600">{errors["items"]}</p>
        )}
      </div>

      <div className="p-5 space-y-5 sm:p-6">
        {invoice.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative rounded-xl border border-sky-200/70 bg-white p-5 shadow-sm"
          >
            <button
              onClick={() => removeItem(index)}
              className="absolute right-3 top-3 text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Item Name *
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-sky-200 px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 transition"
                  maxLength={60}
                  value={item.name}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      items: prev.items.map((it, i) =>
                        i === index
                          ? {
                              ...it,
                              name: e.target.value.replace(
                                /[^A-Za-z0-9 .-]/g,
                                ""
                              ),
                            }
                          : it
                      ),
                    }))
                  }
                />
                {errors[`items.${index}.name`] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[`items.${index}.name`]}
                  </p>
                )}
              </div>

              {/* Qty */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Quantity *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="mt-1 w-full rounded-xl border border-sky-200 px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 transition"
                  value={item.qty}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    const qty = Math.min(Number(v || 0), 10_000);
                    setInvoice((prev) => ({
                      ...prev,
                      items: prev.items.map((it, i) =>
                        i === index ? { ...it, qty } : it
                      ),
                    }));
                  }}
                />
                {errors[`items.${index}.qty`] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[`items.${index}.qty`]}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Unit Price *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-sky-200 px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 transition"
                  value={item.price}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9.]/g, "");
                    const price = Math.min(Number(v || 0), 10_000_000);
                    setInvoice((prev) => ({
                      ...prev,
                      items: prev.items.map((it, i) =>
                        i === index ? { ...it, price } : it
                      ),
                    }));
                  }}
                />
                {errors[`items.${index}.price`] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[`items.${index}.price`]}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-sky-100 px-5 py-4 sm:px-6">
        <button
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-white font-medium shadow-sm hover:bg-sky-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Item
        </button>
      </div>
    </motion.div>
  );
}
