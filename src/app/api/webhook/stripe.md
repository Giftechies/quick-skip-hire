import Stripe from "stripe";
import { ConnectDb } from "@/app/helpers/DB/db";
import Order from "@/app/helpers/models/order";

//  Force Node runtime (required for raw body)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");

  // Read raw body exactly as Stripe sends it
  const rawBody = await request.text();

  let event;
  
  
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new Response(`Webhook signature failed: ${error.message}`, {
      status: 400,
    });
  }
  console.log('webhook is runing',event);

  // Handle event types
  if (event.type === "checkout.session.completed") {
    try {
      await ConnectDb();

      const session = event.data.object;
      const orderId = session.metadata.orderId;

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        stripePaymentIntentId: session.payment_intent,
      });

      console.log("Order updated successfully:", orderId);
    } catch (error) {
      console.error("Database error:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
