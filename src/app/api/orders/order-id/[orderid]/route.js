import { NextResponse } from "next/server"
import Order from "@/app/helpers/models/order"
import { ConnectDb } from "@/app/helpers/DB/db"



export  async function GET(req,{params}){
    try {
        await ConnectDb();
        const {orderid} = await params;
        if(!orderid){
            return NextResponse.json({
                success:false,
                mesaage:'Order is required!'
            },{status:500})
        }
        const order = await Order.findById(orderid);

        if(!order){
            return NextResponse.json({
                success:false,
                message:"Order not found!"
            })
        }

        return NextResponse.json({
            success:true,
            message:'Order found successfully!',
            data:order
        })
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:error.message || ' something went worng!!'
        })
        
    }
}

export async function POST(req,{params}){
    try {
        await ConnectDb();

        const {orderid} = await params;
        if(!orderid){
            return {
                success:false,
                message:'order id required'
            }
        };
        const {status} = req.json()

        const order = await Order.findByIdAndUpdate(orderid,{
            adminOrderStatus:status
        },{new:true})

        if(!order){
            return NextResponse.json({
                success:false,
                message:'order not found'
            })
        };

        return NextResponse({
            success:true,
            message:'Order update successfully',
            data:order
        },{status:200})
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:error.message
        },{status:500})
        
    }
}