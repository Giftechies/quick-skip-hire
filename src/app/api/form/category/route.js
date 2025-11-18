import { NextResponse } from "next/server";
import { ConnectDb } from "@/app/helpers/DB/db";
import Category from "@/app/helpers/models/category";


// CREATE (Add new category)
export async function POST(req) {
  try {
    await ConnectDb();
    const body = await req.json();
    const category = await Category.create(body);

    return NextResponse.json({data:category,success:true,message:"category created succesfully"}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// READ (Get all categories)
export async function GET() {
  try {
    await ConnectDb();
    const categories = await Category.find({});
    return NextResponse.json({data:categories,success:true}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
