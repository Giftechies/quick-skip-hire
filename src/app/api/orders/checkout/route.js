// pages/api/orders/checkout.js

import { ConnectDb } from '@/app/helpers/DB/db';
import User from '@/app/helpers/models/user';
import Order from '@/app/helpers/models/order';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await ConnectDb();

    const {
      totalamount,
      customer,
      deliveryDate,
      extras,
      fullPostcode,
      jobType,
      permitOnHighway,
      postcodeArea,
      skipSize
    } =  await req.json()

    // ============== 1️⃣ VALIDATION ==============
    if (!customer?.email || !customer.firstName) {
   
    return NextResponse.json(
        { success: false, message: 'Customer name and email  is required.' },
        { status: 400 }
      );
    }

    if(!totalamount || totalamount <= 0 || isNaN(totalamount) ||deliveryDate ==='' || deliveryDate === '' || Object.keys(extras).length === 0 || Object.keys(extras).length === 0  ){ 
      return NextResponse.json(
        { success: false, message: 'Insuficient data for order.' },
        { status: 400 }
      );
    }

    // ============== 2️⃣ FIND OR CREATE USER ==============
    let user = await User.findOne({ email: customer.email });

    if (!user) {
      user = await User.create({
        email: customer.email,
        firstName: customer.firstName || customer.name?.split(" ")[0],
        lastName: customer.lastname ||customer.name?.split(" ")[1] || "",
        phoneNumber: customer.phoneNumber || "",
        role: "customer",
      });
    } else {
      user.firstName = customer.name?.split(" ")[0] || user.firstName;
      user.lastName = customer.name?.split(" ")[1] || user.lastName;
      user.phoneNumber = customer.phone || user.phoneNumber;
      await user.save();
    }

    // ============== 3️⃣ CREATE ORDER ==============
    const newOrder = await Order.create({
      userId: user._id,
      totalcost,
      customer,
      deliveryDate,
      extras,
      fullPostcode,
      jobType,
      permitOnHighway,
      postcodeArea,
      skipSize,
      status: "Pending",
    });

    // Link order → user
    user.orders.push(newOrder._id);
    await user.save();

    // ============== 4️⃣ RESPONSE ==============
    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully.",
        orderId: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during checkout",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
