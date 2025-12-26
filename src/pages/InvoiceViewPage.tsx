import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Invoice } from "../types/invoice";
import { getInvoiceById } from "../lib/db/invoiceRepo";
import InvoicePreview from "../components/invoice/InvoicePreview";
import InvoiceActions from "./InvoiceActions"; // adjust path

export default function InvoiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!id) return;
    getInvoiceById(id).then((inv) => setInvoice(inv ?? null));
  }, [id]);

  if (!invoice) {
    return <p className="text-slate-500">Loading invoice…</p>;
  }

  return (
    <div className="space-y-6">
      {/* Reusable action buttons */}
      <InvoiceActions invoice={invoice} />

      {/* Read-only preview */}
      <InvoicePreview invoice={invoice} />
    </div>
  );
}
