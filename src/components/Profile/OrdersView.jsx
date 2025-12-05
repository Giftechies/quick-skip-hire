"use client";

import { fetchAllOrders } from "@/app/apiCalls/form";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaTag, FaRulerCombined, FaMapMarkerAlt, FaRoad, FaDollarSign, FaInfoCircle, FaPlusCircle } from 'react-icons/fa'; // Importing icons

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function Orders({ id }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetchAllOrders(id);
      // Ensure res.data is an array before setting state
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadOrders();
  }, [id]);

  // Loading and Empty States
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }
  
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg">
        <FaInfoCircle className="w-8 h-8 text-gray-400 mb-3" />
        <p className="text-gray-500 font-medium">No orders found.</p>
      </div>
    );
  }

  // Helper component for styled data rows
  const DataRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-2 text-gray-700">
      <Icon className="w-4 h-4 text-indigo-500 " />
      <p>
        <span className="font-semibold">{label}:</span> {value}
      </p>
    </div>
  );

  return (
    <section className="space-y-6 mt-6">
      <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-2">📦 Order History</h2>

      {orders.map((order, index) => (
        <div
          key={index}
          className="w-full bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-indigo-700">Order #{index + 1}</h3>
            {/* Status Badge */}
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
            }`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm">
              <DataRow icon={FaTag} label="Job Type" value={order.jobType} />
              <DataRow icon={FaRulerCombined} label="Skip Size" value={order.skipSize?.size || 'N/A'} />

              <DataRow icon={FaDollarSign} label="Rate" value={formatCurrency(order.skipSize?.rate || 0)} />
              <DataRow icon={FaMapMarkerAlt} label="Postcode" value={order.fullPostcode} />

              <DataRow icon={FaCalendarAlt} label="Delivery Date" value={order.deliveryDate} />
              <DataRow icon={FaClock} label="Time Slot" value={order.timeSlot} />

              <DataRow icon={FaRoad} label="Permit" value={order.permitOnHighway} />
              <DataRow icon={FaDollarSign} label="Payment" value={order.paymentStatus} />
            </div>

            {/* Extras Section */}
            {order.extras && Object.keys(order.extras).length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="flex items-center space-x-2 text-lg font-bold text-gray-800 mb-3">
                  <FaPlusCircle className="w-4 h-4 text-indigo-500" />
                  <span>Optional Extras</span>
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(order.extras).map(([key, val]) => (
                    <li key={key} className="p-3 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-900 font-semibold">
                        {val.qty} × {formatCurrency(val.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        <div className="flex justify-end p-2 " >
          <div className="p-2 border" >
            Total Amount:  <strong>{formatCurrency(order.totalamount)}</strong>
          </div>
        </div>
        </div>
      ))}
    
    </section>
  );
}