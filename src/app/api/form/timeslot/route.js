import { ConnectDb } from "@/app/helpers/DB/db";
import timeslot from "@/app/helpers/models/timeslot";
import { NextResponse } from "next/server";

export async function POST (req){
    try {
        await ConnectDb();
        const {startTime,endTime,startSession,endSession} = await req.json();
        if(!startTime || !endTime || !startSession || !endSession){
            return NextResponse.json({error:"All fields are required"}, {status:400});
        }
        const newSlot = new timeslot({
            startTime,
            endTime,
            startSession,
            endSession
        });
        await newSlot.save();
        return NextResponse.json({success:true, data:newSlot}, {status:201});
        
    } catch (error) {
        return NextResponse.json({ error: err.message }, { status: 500 });
        
    }

}
export async function GET(req){
    try {
        await ConnectDb();
        const slots = await timeslot.find();
        return NextResponse.json({success:true, data:slots}, {status:200});
        
    } catch (error) {
        return NextResponse.json({ error: err.message }, { status: 500 });
        
    }
}