// app/api/checkout/session/route.js
// import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { ConnectDb } from '@/app/helpers/DB/db';
import Order from '@/app/helpers/models/order';
import User from '@/app/helpers/models/user';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await ConnectDb();

  try {
    const body = await request.json();
    // body should have order details: items, total, customer (email), etc.
    const {
      totalamount,
      customer,
      deliveryDate,
      extras,
      fullPostcode,
      jobType,
      permitOnHighway,
      postcodeArea,
      skipSize, timeSlot
    } = body;

    if (!customer?.email || !customer.firstName) {
      return NextResponse.json({ success: false, message: 'User info missing' }, { status: 400 });
    }

    if (!totalamount || !deliveryDate || !fullPostcode || !jobType || !permitOnHighway || !postcodeArea || !skipSize) {
      return NextResponse.json({
        success: false,
        message: 'Insuficient data provided!!'
      }, { status: 500 });
    };


    let user = await User.findOne({ email: customer.email });


    if (!user) {
      user = await User.create({
        email: customer.email,
        phoneNumber: customer.phoneNumber || '',
        firstName: customer.firstName,
        lastName: customer.lastName || "",
        role: 'customer'
      })
    } else {
      user.firstName = customer.firstName;
      user.lastName = customer.lastName || user.lastName;
      user.phoneNumber = customer.phoneNumber || user.phoneNumber;
      await user.save();
    }

    // Option A: Create order in DB with status pending and get its id
    const order = await Order.create({
      userId: user._id, // you can link if user exists
      totalamount: totalamount,
      customer,
      deliveryDate: deliveryDate,
      extras: extras,
      fullPostcode: fullPostcode,
      jobType: jobType,
      permitOnHighway: permitOnHighway,
      skipSize: skipSize,
      timeSlot: timeSlot,
      orderStatus: 'processing',
      paymentStatus: 'pending',
      stripeSessionId: '',
      stripePaymentIntentId: '',
    });

    user.orders.push(order._id);
    await user.save();

    // Build line_items for Checkout (Stripe expects array)
    // const line_items = [
    //   {
    //     price_data: {
    //       currency: 'gbp', // change to your currency
    //       product_data: { name: `Order Id ${order._id}` },
    //       unit_amount: Math.round(totalamount * 100), // in pence
    //     },
    //     quantity: 1,
    //   },
    // ];

    // Create Checkout Session
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   mode: 'payment',
    //   line_items,
    //   success_url: `${process.env.HOST_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.HOST_URL || 'http://localhost:3000'}/checkout/cancel`,
    //   customer_email: customer.email, // prefill on Stripe Checkout page
    //   metadata: {
    //     orderId: order._id.toString(),
    //   },
    // });

    const customerTransectionId = `${customer.email.replace(/[^a-zA-Z0-9]/g, '')}-${customer.firstName}-${customer.phoneNumber}-${(new Date()).toISOString().replace(/[-:.TZ]/g, '')}`;

    const values = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.worldpay.payment_pages-v1.hal+json',
        'Accept': 'application/vnd.worldpay.payment_pages-v1.hal+json',
        'WP-CorrelationId': customerTransectionId, // unique per request 
        'User-Agent': 'QuickSkipHirePaymentGateway/1.0',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.USER}:${process.env.userPassword}`).toString('base64')
      },
      body: JSON.stringify({
        transactionReference: order._id.toString(),
        merchant: { entity: `${process.env.entity}` },
        narrative: {
          line1: `payment of ${totalamount}gbp`,
        },
        value: {
          currency: 'gbp',
          amount: totalamount
        },
        resultURLs: {
          successURL: `${process.env.HOST_URL || 'http://localhost:3000'}/checkout/success`,
          cancelURL: `${process.env.HOST_URL || 'http://localhost:3000'}/checkout/cancel`,
          failureURL: `${process.env.HOST_URL || 'http://localhost:3000'}/checkout/failure`,
          errorURL: `${process.env.HOST_URL || 'http://localhost:3000'}/checkout/error`,
          expiryURL: `${process.env.HOST_URL || 'http://localhost:3000'}/checkout/expiry`

        },
        expiry: process.env.expiry // 15 minutes in seconds 
      })
    };

    const resp = await fetch('https://try.access.worldpay.com/payment_pages', values);
    const data = await resp.json();
    console.log('Payment page response:', data);
    const transactionRef = new URL(data._links.self.href).searchParams.get('transactionReference');

    // Save session id to order for later reconciliation
    order.stripeSessionId = transactionRef;
    await order.save();

    return NextResponse.json({ success: true, url: data.url, sessionId: transactionRef, orderId: order._id.toString() }, { status: 200 });
  } catch (err) {
    console.error('Create checkout session error', err);
    return NextResponse.json({ success: false, message: `${err.message}` }, { status: 500 });
  }
}
