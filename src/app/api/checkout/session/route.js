import { NextResponse } from 'next/server';
import { ConnectDb } from '@/app/helpers/DB/db';
import Order from '@/app/helpers/models/order';
import User from '@/app/helpers/models/user';

export async function POST(request) {
  await ConnectDb();

  try {
    const body = await request.json();
    const {
      totalamount,
      customer,
      deliveryDate,
      extras,
      fullPostcode,
      jobType,
      permitOnHighway,
      postcodeArea,
      skipSize,
      timeSlot
    } = body;

    if (!customer?.email || !customer.firstName) {
      return NextResponse.json({ success: false, message: 'User info missing' }, { status: 400 });
    }

    if (!totalamount || !deliveryDate || !fullPostcode || !jobType || !permitOnHighway || !postcodeArea || !skipSize) {
      return NextResponse.json({ success: false, message: 'Insufficient data provided' }, { status: 400 });
    }

    // -------- USERS ---------
    let user = await User.findOne({ email: customer.email });

    if (!user) {
      user = await User.create({
        email: customer.email,
        phoneNumber: customer.phoneNumber || '',
        firstName: customer.firstName,
        lastName: customer.lastName || "",
        role: 'customer'
      });
    } else {
      user.firstName = customer.firstName;
      user.lastName = customer.lastName || user.lastName;
      user.phoneNumber = customer.phoneNumber || user.phoneNumber;
      await user.save();
    }

    // -------- ORDER IN DB ---------
    const order = await Order.create({
      userId: user._id,
      totalamount,
      customer,
      deliveryDate,
      extras,
      fullPostcode,
      jobType,
      permitOnHighway,
      skipSize,
      timeSlot,
      orderStatus: 'processing',
      paymentStatus: 'pending',
      worldpayOrderCode: "",
    });

    user.orders.push(order._id);
    await user.save();

    // Create unique order code for Worldpay (required)
    const worldpayOrderCode = `WP_${order._id}_${Date.now()}`;

    // -------- WORLD PAY HPP REQUEST BODY ---------
    const xmlRequestBody = `
      <paymentService version="1.4" merchantCode="${process.env.WORLDPAY_MERCHANT_CODE}">
        <submit>
          <order orderCode="${worldpayOrderCode}">
            <description>Order Payment - ${order._id}</description>
            <amount value="${Math.round(totalamount * 100)}" currencyCode="GBP" exponent="2" />
            <paymentMethodMask>
              <include code="ALL" />
            </paymentMethodMask>
            <shopper>
              <shopperEmailAddress>${customer.email}</shopperEmailAddress>
            </shopper>
            <successURL>${process.env.WORLDPAY_SUCCESS_URL}</successURL>
            <cancelURL>${process.env.WORLDPAY_CANCEL_URL}</cancelURL>
          </order>
        </submit>
      </paymentService>
    `;

    const worldpayResponse = await fetch(process.env.WORLDPAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml"
      },
      body: xmlRequestBody
    });

    const xmlResponse = await worldpayResponse.text();

    // You MUST extract redirect URL from XML
    const redirectUrl = extractRedirectUrl(xmlResponse); // implement this helper

    if (!redirectUrl) {
      return NextResponse.json(
        { success: false, message: "Worldpay did not return a redirect URL", raw: xmlResponse },
        { status: 500 }
      );
    }

    // Save order code so webhook can match it later
    order.worldpayOrderCode = worldpayOrderCode;
    await order.save();

    return NextResponse.json(
      { success: true, url: redirectUrl, orderId: order._id.toString() },
      { status: 200 }
    );

  } catch (err) {
    console.error('Worldpay session creation error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
