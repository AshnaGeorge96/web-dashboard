import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("filtereturnsDB"); // your DB name
    const collection = db.collection("returns"); // collection name

    const returns = await collection.find({}).toArray();
    return NextResponse.json(returns, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch returns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newReturn = await req.json();

    // Generate _id if missing
    if (!newReturn._id) {
      newReturn._id = crypto.randomUUID();
    }

    const client = await clientPromise;
    const db = client.db("filtereturnsDB");
    const collection = db.collection("returns");

    await collection.insertOne(newReturn);
    return NextResponse.json(newReturn, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add return" }, { status: 500 });
  }
}
