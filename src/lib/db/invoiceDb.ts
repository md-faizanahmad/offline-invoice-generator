import type { Invoice } from "../../types/invoice";
import { openDB, STORES } from "./database";

// const DB_NAME = "invoice-db";
// const STORE = "invoices";
// const VERSION = 3;

/* CREATE or UPDATE */
export async function saveInvoice(invoice: Invoice): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORES.INVOICES, "readwrite");
  console.log(tx);
  tx.objectStore(STORES.INVOICES).put(invoice);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("invoices-updated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/* DELETE */
export async function deleteInvoice(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORES.INVOICES, "readwrite");
  tx.objectStore(STORES.INVOICES).delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("invoices-updated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/* GET ONE (Edit) */
export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  const db = await openDB();
  const tx = db.transaction(STORES.INVOICES, "readonly");
  const req = tx.objectStore(STORES.INVOICES).get(id);

  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result);
  });
}

/* LIST RECENT (Top 5) */
export async function getRecentInvoices(limit = 5): Promise<Invoice[]> {
  const db = await openDB();

  return new Promise((resolve) => {
    const tx = db.transaction(STORES.INVOICES, "readonly");
    const store = tx.objectStore(STORES.INVOICES);
    const index = store.index("createdAt");

    const invoices: Invoice[] = [];
    const req = index.openCursor(null, "prev");

    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor && invoices.length < limit) {
        invoices.push(cursor.value);
        cursor.continue();
      } else {
        resolve(invoices);
      }
    };
  });
}
