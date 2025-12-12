import { ConnectDb } from "@/app/helpers/DB/db";
import Order from "@/app/helpers/models/order";
import { xml2js } from "xml-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const rawXml = await request.text();

    // Convert XML → JS object
    const parsed = xml2js(rawXml, { compact: true, trim: true });

    const event =
      parsed?.paymentService?.notify?.orderStatusEvent;

    if (!event) {
      return new Response("Invalid Webhook", { status: 400 });
    }

    const orderCode = event?._attributes?.orderCode;
    const lastEvent =
      event?.payment?.lastEvent?._text || "UNKNOWN";

    // Connect DB
    await ConnectDb();

    // Map Worldpay status → your DB status
    let paymentStatus = "pending";

    if (lastEvent === "AUTHORISED") {
      paymentStatus = "paid";
    } else if (lastEvent === "REFUSED") {
      paymentStatus = "failed";
    } else if (lastEvent === "CANCELLED") {
      paymentStatus = "cancelled";
    } else {
      paymentStatus = "error";
    }

    // Update your order using stored worldpayOrderCode
    const order = await Order.findOneAndUpdate(
      { worldpayOrderCode: orderCode },
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      console.error("No matching order for:", orderCode);
      return new Response("Order not found", { status: 404 });
    }

    console.log("Worldpay webhook processed:", {
      orderCode,
      paymentStatus,
    });

    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error("Worldpay webhook error:", err);
    return new Response("Webhook error", { status: 500 });
  }
}
