import { NextResponse } from "next/server";
import Order from "@/app/helpers/models/order";
import Stripe from "stripe";
import { ConnectDb } from "@/app/helpers/DB/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req,){
    await ConnectDb();
    try {
        // const param = await params
         const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

        if(!sessionId){
            return NextResponse.json({
                success:false,
                message:'session id not found'
            })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)
        const orderid = session.metadata.orderId

        const order = await Order.findByIdAndUpdate(orderid,{
            paymentStatus:'paid',
        });

        if(!order){
            return NextResponse.json({
                success:false,
                message:'order not found'
            },{status:400})
        }

        console.log(order.paymentStatus);
        

        if(order.paymentStatus !=='paid'){
            return NextResponse.json({
                success:false,
                message:'Payment status is pending.Please try again'
            },{status:400})

        }

        return NextResponse.json({
            success:true,
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

