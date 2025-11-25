import Postcode from "@/app/helpers/models/postcode";
import {ConnectDb} from "@/app/helpers/DB/db";

// CREATE (single postcode)
export async function POST(req) {
  try {
    await ConnectDb();
    const body = await req.json();
    const postcode = await Postcode.create(body);
    return new Response(JSON.stringify(postcode), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// READ (all postcodes)
export async function GET() {
  try {
    await ConnectDb();
    const postcodes = await Postcode.find({}).sort({postcode:1});
    return new Response(JSON.stringify(postcodes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
