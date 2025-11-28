import User  from "@/app/helpers/models/user";
import { ConnectDb } from "@/app/helpers/DB/db";
import { NextResponse } from "next/server";



export async function GET(req,{params}) {
    try {
        await ConnectDb()
        const {id} = await params;
          if(!id){
            return NextResponse.json({
                success:false,
                message:'user id is required'
            })
        }

        const user = await User.findById(id)

          if(!user){
            return NextResponse.json({
                success:false,
                message:'User not found'
            })
        }

        return NextResponse.json({
            success:true,
            message:"user found!!ff",
            user
        })


        
    } catch (error) {
          return NextResponse.json({
            success:false,
            message:error.message || "something went worng"
        })
    }
    
}

export async function PUT(req,{params}){
    try {
        await ConnectDb()
        const {id} = await params
        if(!id){
            return NextResponse.json({
                success:false,
                message:'user id is required'
            })
        }

        const {email,firstName,lastName,phoneNumber} = await req.json();

        console.log(email,firstName,lastName,phoneNumber);
        

        const user = await User.findByIdAndUpdate(id,{email,firstName,lastName,phoneNumber}, { new: true })
        console.log(user,"user>>>");
        

        if(!user){
            return NextResponse.json({
                success:false,
                message:'User not found'
            })
        }

        return NextResponse.json({
            success:true,
            message:"Profile successfully update!",
            user
        })
        
    } catch (error) {

        return NextResponse.json({
            success:false,
            message:error.message || "something went worng"
        })
        
    }
}