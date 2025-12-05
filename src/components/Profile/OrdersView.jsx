"use client";

import { fetchAllOrders } from "@/app/apiCalls/form";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaTag, FaRulerCombined, FaMapMarkerAlt, FaRoad, FaDollarSign, FaInfoCircle, FaPlusCircle, FaReceipt, FaCube } from 'react-icons/fa'; // Added FaReceipt and FaCube
import { Button } from "../ui/button";

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Utility function to calculate total extras cost
const calculateTotalExtrasCost = (extras) => {
  if (!extras || Object.keys(extras).length === 0) {
    return 0;
  }
  return Object.values(extras).reduce((total, extra) => {
    return total + (extra.qty * extra.price);
  }, 0);
};

export default function OrderView({ order, setSelectedOrder }) {

  const skipRate = order.skipSize?.rate || 0;
  const totalExtrasCost = calculateTotalExtrasCost(order.extras);
  // Assuming totalamount includes the skip rate and extras cost, but calculating it here for clarity if needed
  // const calculatedTotal = skipRate + totalExtrasCost; // Use this if totalamount is not guaranteed to be correct

  // Helper component for styled data rows
  const DataRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3 text-gray-700 p-2 bg-gray-50 rounded-lg shadow-sm">
      <Icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
      <p className="flex justify-between w-full">
        <span className="font-medium text-gray-600">{label}:</span>
        <span className="font-semibold text-gray-800">{value}</span>
      </p>
    </div>
  );

  // Helper component for the price summary rows
  const PriceSummaryRow = ({ icon: Icon, label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center py-2 ${isTotal ? 'text-lg font-bold text-indigo-700 border-t-2 border-indigo-200 mt-2 pt-3' : 'text-md font-medium text-gray-700'}`}>
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${isTotal ? 'text-indigo-600' : 'text-gray-500'}`} />
        <span>{label}</span>
      </div>
      <span className={`${isTotal ? 'text-xl font-extrabold text-indigo-800' : 'font-semibold text-gray-900'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <section className="space-y-8  pb-4 ">
      <h2 className="text-4xl font-extrabold text-gray-900 border-b-4 border-indigo-500 pb-3">
        📦 Order Details
      </h2>
      <div className={'flex justify-end '}>
        <Button className={' cursor-pointer '} size="sm" onClick={() => setSelectedOrder(null)}>
          ← Back to Orders
        </Button>
      </div>

      <div
        className="w-full bg-white shadow-2xl hover:shadow-indigo-300/50 transition-all duration-500 rounded-2xl overflow-hidden border border-gray-200"
      >
        <div className="bg-indigo-600 p-4 border-b border-indigo-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Order Information</h3>
          {/* Status Badge */}
          <span className={`px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-full ${
            order.orderStatus === 'Completed' ? 'bg-green-300 text-green-900' :
            order.orderStatus === 'Pending' ? 'bg-yellow-300 text-yellow-900' :
            'bg-blue-300 text-blue-900'
          }`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="p-6">
          {/* Main Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <DataRow icon={FaTag} label="Job Type" value={order.jobType} />
            <DataRow icon={FaRulerCombined} label="Skip Size" value={order.skipSize?.size || 'N/A'} />
            <DataRow icon={FaDollarSign} label="Rate / Skip Price" value={formatCurrency(skipRate)} />

            <DataRow icon={FaMapMarkerAlt} label="Postcode" value={order.fullPostcode} />

            <DataRow icon={FaCalendarAlt} label="Delivery Date" value={order.deliveryDate} />
            <DataRow icon={FaClock} label="Time Slot" value={order.timeSlot} />

            <DataRow icon={FaRoad} label="Permit" value={order.permitOnHighway} />
            <DataRow icon={FaInfoCircle} label="Payment Status" value={order.paymentStatus} />
          </div>

          {/* Extras Section */}
          {order.extras && Object.keys(order.extras).length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="flex items-center space-x-2 text-xl font-bold text-gray-800 mb-4">
                <FaPlusCircle className="w-5 h-5 text-indigo-600" />
                <span>Optional Extras</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {Object.entries(order.extras).map(([key, val]) => (
                  <li key={key} className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex justify-between items-center transition-shadow hover:shadow-md">
                    <span className="font-medium text-gray-700 capitalize">{key}</span>
                    <span className="text-gray-900 font-bold">
                      {val.qty} × {formatCurrency(val.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Price Summary Footer */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-100">
          <h4 className="flex items-center space-x-2 text-xl font-bold text-gray-800 mb-4">
            <FaReceipt className="w-5 h-5 text-indigo-600" />
            <span>Order Summary</span>
          </h4>
          <div className="space-y-1">
            <PriceSummaryRow icon={FaCube} label="Skip Rate" value={formatCurrency(skipRate)} />
            <PriceSummaryRow icon={FaPlusCircle} label="Total Extras Cost" value={formatCurrency(totalExtrasCost)} />
            <PriceSummaryRow icon={FaPlusCircle} label="VAT" value={formatCurrency((skipRate + totalExtrasCost) * 0.2)} />
            <PriceSummaryRow 
              icon={FaDollarSign} 
              label="Total Amount" 
              value={formatCurrency(order.totalamount)} 
              isTotal={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}