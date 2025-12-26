import type { Invoice } from "./invoice";

export type InvoiceUpdater = (updater: (prev: Invoice) => Invoice) => void;
