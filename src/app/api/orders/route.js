import { NextResponse } from "next/server";
import Order from "@/app/helpers/models/order";
import { ConnectDb } from "@/app/helpers/DB/db";

export async function GET(req){

    try {
        await ConnectDb()
        const {searchParams} = new URL(req.url)
        const status = searchParams.get("status")
        let filter = {}
        if(status){
            filter.adminOrderStatus = status
        }
        const order = await Order.find(filter);

        return NextResponse.json({
            success:false,
            message:'Orders found successfull!!',
            data:order
        })
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:error.message || 'something went worng'
        },{status:500})
        
    }
}