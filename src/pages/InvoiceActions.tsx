import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Invoice } from "../types/invoice";
import { saveInvoice } from "../lib/db/invoiceRepo";
import { generateInvoicePdf } from "../utils/generateInvoicePdf";
import {
  ArrowLeft,
  FileDown,
  Eye,
  Pencil,
  Copy,
  Share2,
  Mail,
  RotateCw,
  List,
} from "lucide-react";

interface InvoiceActionsProps {
  invoice: Invoice;

  showBack?: boolean;
  showList?: boolean;
  showEdit?: boolean;
  showDuplicate?: boolean;
  showPreview?: boolean;
  showDownload?: boolean;
  showShare?: boolean;

  onBack?: () => void;
  onAfterDuplicate?: (invoice: Invoice) => void;
}

export default function InvoiceActions({
  invoice,
  showBack = true,
  showList = true,
  showEdit = true,
  showDuplicate = true,
  showPreview = true,
  showDownload = true,
  showShare = true,
  onBack,
  onAfterDuplicate,
}: InvoiceActionsProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<"preview" | "download" | null>(null);

  const shareText = `Invoice ${invoice.invoiceNumber}\nAmount: ${invoice.totals.total} ${invoice.currency.code}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const mailtoUrl = `mailto:?subject=Invoice ${
    invoice.invoiceNumber
  }&body=${encodeURIComponent(shareText)}`;

  const handlePdf = async (type: "preview" | "download") => {
    setLoading(type);
    try {
      const blob = await generateInvoicePdf(invoice);
      const url = URL.createObjectURL(blob);

      if (type === "preview") {
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invoice_${invoice.invoiceNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(`PDF ${type} failed:`, err);
      alert(`Failed to ${type} PDF`);
    } finally {
      setLoading(null);
    }
  };

  const handleDuplicate = async () => {
    const copy: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      invoiceNumber: "",
      createdAt: Date.now(),
    };
    await saveInvoice(copy);
    onAfterDuplicate?.(copy);
    navigate(`/invoice/edit/${copy.id}`);
  };

  // Button styles
  const baseBtn =
    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 min-w-[52px] sm:min-w-auto";

  const secondaryBtn = `${baseBtn} border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:shadow-sm`;

  const primaryBtn = `${baseBtn} bg-sky-600 text-white hover:bg-sky-700 shadow-sm hover:shadow-md`;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {showBack && (
        <button
          onClick={onBack ?? (() => navigate(-1))}
          className={secondaryBtn}
          title="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
      )}

      {showList && (
        <button
          onClick={() => navigate("/invoice/history")}
          className={secondaryBtn}
          title="View all invoices"
        >
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">List</span>
        </button>
      )}

      {showDownload && (
        <button
          onClick={() => handlePdf("download")}
          disabled={loading === "download"}
          className={`${primaryBtn} ${
            loading === "download" ? "opacity-70 cursor-not-allowed" : ""
          }`}
          title="Download PDF"
        >
          {loading === "download" ? (
            <RotateCw className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Download</span>
        </button>
      )}

      {showPreview && (
        <button
          onClick={() => handlePdf("preview")}
          disabled={loading === "preview"}
          className={`${primaryBtn} ${
            loading === "preview" ? "opacity-70 cursor-not-allowed" : ""
          }`}
          title="View PDF"
        >
          {loading === "preview" ? (
            <RotateCw className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">View PDF</span>
        </button>
      )}

      {showEdit && (
        <button
          onClick={() => navigate(`/invoice/edit/${invoice.id}`)}
          className={secondaryBtn}
          title="Edit invoice"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      )}

      {showDuplicate && (
        <button
          onClick={handleDuplicate}
          className={secondaryBtn}
          title="Duplicate invoice"
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Duplicate</span>
        </button>
      )}

      {showShare && (
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryBtn}
            title="Share via WhatsApp"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <a href={mailtoUrl} className={secondaryBtn} title="Share via Email">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </a>
        </div>
      )}
    </div>
  );
}
