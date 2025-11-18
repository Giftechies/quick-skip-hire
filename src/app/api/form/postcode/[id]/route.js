import {ConnectDb} from "@/app/helpers/DB/db";
import Postcode from "@/app/helpers/models/postcode";
import mongoose from 'mongoose'
// UPDATE
export async function PUT(req, { params }) {
  try {
    await ConnectDb();
    const body = await req.json();
    const {id} = await params
    
    const updated = await Postcode.findByIdAndUpdate(id, body, { new: true });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// DELETE
export async function DELETE(req, { params }) {
  try {
    await ConnectDb();
    const {id} = await params
    console.log("delete>>>>>",id);
    console.log("delete>>>>>",params

    );
    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ error: "Invalid ID format" }),
        { status: 400 }
      );
    }

    // 2. Try deleting
    const deleted = await Postcode.findByIdAndDelete(id);

    // 3. Not found
    if (!deleted) {
      return new Response(
        JSON.stringify({ error: "Postcode not found" }),
        { status: 404 }
      );
    }

    // 4. Success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Postcode deleted successfully",
        deleted,
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}