"use client";

import React from "react";
import { format } from "date-fns";
import {
  FaTag,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaRoad,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaUser,
  FaInfoCircle,
  FaCreditCard,
  FaRegCheckCircle,
} from "react-icons/fa";
import { Mail } from "lucide-react";

/* ----------------- UTILITIES ------------------- */

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount ?? 0);

// ⭐ FIX: Safe date formatting
const safeFormatDate = (date, pattern = "dd MMM yyyy") => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "N/A";
  return format(parsed, pattern);
};

const getStatusColor = (status) => {
  const s = status?.toLowerCase();

  if (["paid", "completed"].includes(s))
    return "bg-green-50 text-green-700 border-green-200";

  if (["processing", "new"].includes(s))
    return "bg-yellow-50 text-yellow-700 border-yellow-200";

  if (["cancelled"].includes(s))
    return "bg-red-50 text-red-700 border-red-200";

  return "bg-gray-50 text-gray-700 border-gray-200";
};

const Row = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-gray-50 rounded-lg border flex items-start space-y-3 flex-col ">
   <div className="flex gap-4 items-center justify-center" >
     <Icon className="w-5 h-5 text-gray-600 mt-1" />
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
   </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-800 break-words">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

/* ----------------- MAIN COMPONENT ------------------- */

export default function AdminOrderPreview({ orderData }) {
    console.log(orderData,"ddd");
    
  if (!orderData)
    return (
      <div className="p-10 text-center text-gray-500">
        <FaInfoCircle className="w-8 h-8 mx-auto mb-2" />
        No order data available.
      </div>
    );

  const data = orderData;

  const {
    _id,
    customer,
    skipSize,
    totalamount,
    deliveryDate,
    extras,
    fullPostcode,
    jobType,
    permitOnHighway,
    timeSlot,
    orderStatus,
    adminOrderStatus,
    paymentStatus,
    createdAt,
    userId,
  } = data;

  const safeExtras = extras ? Object.entries(extras) : [];

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50 space-y-10">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaRegCheckCircle className="w-7 h-7 text-indigo-600 mr-3" />
          Order #{_id?.slice(-8)}
        </h1>

        {/* ⭐ FIX: Safe date formatter */}
        <p className="text-sm text-gray-500 mt-1">
          Placed on {safeFormatDate(createdAt, "dd MMM yyyy, hh:mm a")}
        </p>
      </header>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* STATUS SECTION */}
          <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Status</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg text-center border ${getStatusColor(orderStatus)}`}>
                <p className="text-xs uppercase font-bold">Customer</p>
                <p className="text-lg font-semibold capitalize">{orderStatus || "N/A"}</p>
              </div>

              <div className={`p-4 rounded-lg text-center border ${getStatusColor(adminOrderStatus)}`}>
                <p className="text-xs uppercase font-bold">Admin</p>
                <p className="text-lg font-semibold capitalize ">{adminOrderStatus || "N/A"}</p>
              </div>

              <div className={`p-4 rounded-lg text-center border ${getStatusColor(paymentStatus)}`}>
                <p className="text-xs uppercase font-bold">Payment</p>
                <p className="text-lg font-semibold capitalize">{paymentStatus || "N/A"}</p>
              </div>
            </div>
          </section>
          

          {/* ORDER DETAILS */}
          <section className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Order Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Row
                icon={FaCalendarAlt}
                label="Delivery Date"
                value={safeFormatDate(deliveryDate, "EEE, dd MMM yyyy")}
              />

              <Row icon={FaClock} label="Time Slot" value={timeSlot} />
              <Row icon={FaTag} label="Job Type" value={jobType} />
              <Row icon={FaRulerCombined} label="Skip Size" value={skipSize?.size} />
              <Row icon={FaMapMarkerAlt} label="Postcode" value={fullPostcode} />
              <Row icon={FaRoad} label="Permit Required" value={permitOnHighway} />
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">
          {/* FINANCIAL SUMMARY */}
          <section className="bg-indigo-600 text-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Financial Summary</h2>

            <div className="space-y-3 text-white/90">
              <div className="flex justify-between text-lg">
                <span>Skip Base Rate</span>
                <span>{formatCurrency(skipSize?.rate)}</span>
              </div>

              <div className="flex justify-between text-lg">
                <span>Extras</span>
                <span>
                  {formatCurrency(totalamount - (skipSize?.rate || 0))}
                </span>
              </div>

              <hr className="border-white/30" />

              <div className="flex justify-between text-3xl font-extrabold pt-2">
                <span>Total</span>
                <span>{formatCurrency(totalamount)}</span>
              </div>
            </div>
          </section>

          {/* CUSTOMER INFO */}
          <section className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Customer
            </h2>
            <Row icon={Mail} label="Email" value={customer?.email} />

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>
                Order ID: 
                <span className="font-mono text-gray-700">{_id}</span>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* EXTRAS SECTION */}
      {safeExtras.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-sm border mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Extra / Hazard Items ({safeExtras.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {safeExtras.map(([item, details]) => (
              <div
                key={item}
                className="p-4 bg-red-50 border-l-4 border-gray-400 rounded-lg"
              >
                <p className="font-semibold text-gray-800">{item}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Qty: {details.qty} • Price:{" "}
                  {formatCurrency(details.price)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
