import Stripe from "stripe";
import { ConnectDb } from "@/app/helpers/DB/db";
import Order from "@/app/helpers/models/order";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // ❗ IMPORTANT for Stripe webhooks
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400,
    });
  }

  // 🎯 Handle the event type
  if (event.type === "checkout.session.completed") {
    try {
      await ConnectDb();

      const session = event.data.object;

      const orderId = session.metadata.orderId;

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus:"paid",
        stripePaymentIntentId: session.payment_intent,
      });

      console.log("Order marked as paid:", orderId);

    } catch (err) {
      console.error("DB Error: ", err);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
