import { motion } from "framer-motion";
import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import type { ValidationErrors } from "../../types/validation";
import { Building2 } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
  errors: ValidationErrors;
};

export default function SellerSection({ invoice, setInvoice, errors }: Props) {
  const showTaxId = invoice.tax.mode !== "NONE";
  const taxLabel = invoice.tax.label || "Tax";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-sky-200/50 bg-white/90 shadow-md overflow-hidden backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-sky-100 bg-sky-50/50 px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Building2 className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-sky-900">Seller Details</h2>
      </div>

      <div className="p-5 space-y-5 sm:p-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Seller Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={50}
            placeholder="Company / Full Name"
            className="mt-1 w-full rounded-xl border border-sky-200 px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 transition"
            value={invoice.seller.name}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                seller: {
                  ...prev.seller,
                  name: e.target.value.replace(/[^A-Za-z .-]/g, ""),
                },
              }))
            }
          />
          {errors["seller.name"] && (
            <p className="mt-1 text-xs text-red-600">{errors["seller.name"]}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Seller Address <span className="text-red-500">*</span>
          </label>
          <textarea
            className="mt-1 w-full rounded-xl border border-sky-200 px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 transition min-h-20"
            placeholder="Street, City, State, ZIP"
            value={invoice.seller.address}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                seller: { ...prev.seller, address: e.target.value },
              }))
            }
          />
          {errors["seller.address"] && (
            <p className="mt-1 text-xs text-red-600">
              {errors["seller.address"]}
            </p>
          )}
        </div>

        {/* Tax ID */}
        {showTaxId && (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              {taxLabel} ID
            </label>
            <input
              type="text"
              maxLength={15}
              placeholder={`${taxLabel} ID`}
              className="mt-1 w-full rounded-xl border border-sky-200 px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 transition"
              value={invoice.seller.taxId ?? ""}
              onChange={(e) =>
                setInvoice((prev) => ({
                  ...prev,
                  seller: {
                    ...prev.seller,
                    taxId: e.target.value
                      .toUpperCase()
                      .replace(/[^0-9A-Z]/g, ""),
                  },
                }))
              }
            />
            {errors["seller.taxId"] && (
              <p className="mt-1 text-xs text-red-600">
                {errors["seller.taxId"]}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
