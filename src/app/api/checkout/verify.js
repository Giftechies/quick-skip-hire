import { NextResponse } from "next/server";
import Order from "@/app/helpers/models/order";
import Stripe from "stripe";
import { ConnectDb } from "@/app/helpers/DB/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req,{params}){
    await ConnectDb();
    try {
        const param = await params
        const sessionId = param.session_id

        if(!sessionId){
            return NextResponse({
                success:false,
                message:'session id not found'
            })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)
        const orderid = session.metadata.orderId

        const order = await Order.findById(orderid);

        if(!order){
            return NextResponse.json({
                success:false,
                message:'order not found'
            },{status:400})
        }

        if(order.paymentStatus !=='paid'){
            return NextResponse.json({
                success:false,
                message:'Payment status is pending.Please try again'
            },{status:400})

        }

        return NextResponse({
            success:ture,
            message:"order found and payment paid",
            order:order,
            paymentStatus:'paid'
        })
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:error.message || 'Payment failed.Please try again!'
        },{status:500})
        
    }
}

