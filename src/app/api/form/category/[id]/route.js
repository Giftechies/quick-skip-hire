import { NextResponse } from "next/server";
import { ConnectDb } from"@/app/helpers/DB/db";
import Category from "@/app/helpers/models/category";

// READ one category
export async function GET(req, { params }) {
  try {
    await ConnectDb();
    const {id} = await params
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE category
export async function PUT(req, { params }) {
  try {
    await ConnectDb();
    const {id} = await params
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({success:true,data:category});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE category
export async function DELETE(req, { params }) {
  try {
    
    await ConnectDb();
    const {id} = await params
    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ error: "Not found",
      message:"not deleted",
      sucess:false
     }, { status: 404 });
    return NextResponse.json({ sucess:true,
      message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ sucess:false,message:"delete failed",error: error.message }, { status: 500 });
  }
}
