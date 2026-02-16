import { NextResponse } from "next/server";
import Order from "@/app/helpers/models/order";
// import Stripe from "stripe";
import { ConnectDb } from "@/app/helpers/DB/db";
import { sendMail } from "@/utils/sendemailForpayment";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req,) {
    await ConnectDb();
    try {
        await new Promise(resolve => setTimeout(resolve, 8000));
        // const param = await params
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");
        const orderId = searchParams.get("order_id");
        const mail = searchParams.get("mail");

        if (!sessionId && !orderId) {
            return NextResponse.json({
                success: false,
                message: 'session id not found'
            })
        }

        const session = await fetch(
            `https://try.access.worldpay.com/paymentQueries/payments?transactionReference=${sessionId.toString()}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.worldpay.payment-queries-v1.hal+json',
                    Authorization: 'Basic ' + Buffer.from(`${process.env.USER}:${process.env.userPassword}`).toString('base64')
                }
            }
        );

        const response = (await session.json())._embedded.payments[0];

        console.log(response);

        if (response.lastEvent.trim() === 'settlementRequestSubmitted') {

            const paymentStatus = await fetch(
                `https://try.access.worldpay.com/${response._links.self.href}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/vnd.worldpay.payment-queries-v1.hal+json',
                        Authorization: 'Basic ' + Buffer.from(`${process.env.USER}:${process.env.userPassword}`).toString('base64')
                    }
                });

            const paymentStatusResponse = await paymentStatus.json();
            console.log(paymentStatusResponse);
        }

        const order = await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
        }, { new: true });

        if (!order) {
            return NextResponse.json({
                success: false,
                message: 'order not found'
            }, { status: 400 })
        }

        console.log(order.paymentStatus);


        if (order.paymentStatus.trim().toLowerCase() !== 'paid') {
            return NextResponse.json({
                success: false,
                message: 'Payment status is pending.Please try again'
            }, { status: 400 })

        }

        await sendMail(mail, orderId);

        return NextResponse.json({
            success: true,
            message: "order found and payment paid",
            order: order,
            paymentStatus: 'paid'
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || 'Payment failed.Please try again!'
        }, { status: 500 })

    }
}

