// models/Order.js

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // FRONTEND PAYLOAD FIELDS
    totalamount: Number,     // Note: frontend sends "totalamount", not "totalAmount"
    customer: {
      name: String,
      phone: String,
      email: String,
      address: String,
    },
    deliveryDate: String,

    extras: {
      type: Object, // You receive dynamic keys -> must use Object
      default: {},
    },

    fullPostcode: String,
    jobType: String,
    permitOnHighway: String,
    postcodeArea: String,

    skipSize: {
      rate: Number,
      size: String,
      timeslot: String,
    },
    timeSlot: String,

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "Pending",
    },
 paymentStatus: {
  type: String,
  enum: ['pending','paid','failed'],
  default: 'pending',
},
stripeSessionId: { type: String },
stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
