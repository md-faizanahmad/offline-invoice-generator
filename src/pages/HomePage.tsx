// src/pages/Home.tsx
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  FileText,
  Download,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import InvoiceList from "../components/invoice/InvoiceList"; // your existing component

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const cardHover = {
  whileHover: { y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  transition: { duration: 0.3 },
};

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12"
    >
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Offline • Private • Free</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            QuickInvoice
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Create, manage and download professional invoices{" "}
            <span className="font-semibold text-sky-600">
              completely offline
            </span>
            .
            <br className="hidden sm:block" />
            No account. No tracking. Your data stays with you.
          </p>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/invoice/new"
            className="group flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-xl font-medium shadow-lg hover:bg-sky-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300"
          >
            <PlusCircle className="h-5 w-5" />
            Create New Invoice
            <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/invoice/history"
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <Clock className="h-5 w-5" />
            View Recent Invoices
          </Link>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6 mb-16"
      >
        {[
          {
            icon: <ShieldCheck className="h-8 w-8 text-sky-600" />,
            title: "100% Offline",
            desc: "Works without internet. All data stored locally.",
          },
          {
            icon: <FileText className="h-8 w-8 text-sky-600" />,
            title: "Professional Templates",
            desc: "Clean, modern invoice designs ready to print or share.",
          },
          {
            icon: <Download className="h-8 w-8 text-sky-600" />,
            title: "Instant PDF Export",
            desc: "Generate and download PDFs in seconds.",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            {...cardHover}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Invoices Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-6 w-6 text-sky-600" />
              Recent Invoices
            </h2>

            <Link
              to="/invoice/history"
              className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 hover:underline"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <InvoiceList />
        </motion.div>
      </div>
    </motion.div>
  );
}
