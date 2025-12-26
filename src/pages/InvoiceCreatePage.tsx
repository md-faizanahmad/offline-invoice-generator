import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Invoice } from "../types/invoice";
import { createEmptyInvoice } from "../utils/createEmptyInvoice";
import { calculateTotals } from "../utils/calculateTotals";
import { validateInvoice } from "../utils/validateInvoice";
import type { ValidationErrors } from "../types/validation";
import type { InvoicePresetKey } from "../config/invoicePresets";
import { ArrowLeft, Save } from "lucide-react";

// Components
import PresetSelector from "../components/invoice/PresetSelector";
import InvoiceHeader from "../components/invoice/InvoiceHeader";
import SellerSection from "../components/invoice/SellerSection";
import CustomerSection from "../components/invoice/CustomerSection";
import ItemsSection from "../components/invoice/ItemsSection";
import TotalsSection from "../components/invoice/TotalsSection";
import InvoiceList from "../components/invoice/InvoiceList"; // Uncommented & used
import { saveInvoice } from "../lib/db/invoiceRepo";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function InvoiceCreatePage() {
  const [presetKey, setPresetKey] = useState<InvoicePresetKey>("INDIA_GST");
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice>(
    createEmptyInvoice("INDIA_GST")
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  /* Preset change handler */
  const handlePresetChange = (key: InvoicePresetKey) => {
    setPresetKey(key);
    setInvoice(createEmptyInvoice(key));
    setErrors({});
  };

  /* Centralized invoice updater */
  const updateInvoice = (updater: (prev: Invoice) => Invoice) => {
    setInvoice((prev) => {
      const updated = updater(prev);
      return {
        ...updated,
        totals: calculateTotals(updated),
      };
    });
  };

  /* Generate invoice */
  const handleGenerate = async () => {
    const validationErrors = validateInvoice(invoice);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let inv = invoice;
    if (!invoice.invoiceNumber) {
      const number = await generateInvoiceNumber(invoice);
      inv = { ...invoice, invoiceNumber: number };
    }

    await saveInvoice(inv);
    setInvoice(inv);
    navigate(`/invoice/view/${inv.id}`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Header Bar with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-gray-50 border border-gray-200 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-sky-700 transition"
          >
            <Save className="h-4 w-4" />
            Generate Invoice
          </button>
        </motion.div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Main Form */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={itemVariants}>
            <InvoiceHeader invoice={invoice} setInvoice={updateInvoice} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PresetSelector value={presetKey} onChange={handlePresetChange} />
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={itemVariants}>
            <SellerSection
              invoice={invoice}
              setInvoice={updateInvoice}
              errors={errors}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <CustomerSection
              invoice={invoice}
              setInvoice={updateInvoice}
              errors={errors}
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <ItemsSection
            invoice={invoice}
            setInvoice={updateInvoice}
            errors={errors}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TotalsSection invoice={invoice} setInvoice={updateInvoice} />
        </motion.div>

        {/* Action Buttons (bottom) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
        >
          <button
            onClick={() => navigate("/")}
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-sky-700 transition"
          >
            Generate & Save Invoice
          </button>
        </motion.div>
      </div>

      {/* Recent Invoices Section */}
      <motion.div variants={itemVariants} className="mx-auto max-w-4xl mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
          <Link
            to="/invoice/history"
            className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white shadow-sm">
          <InvoiceList />
        </div>
      </motion.div>
    </motion.div>
  );
}
