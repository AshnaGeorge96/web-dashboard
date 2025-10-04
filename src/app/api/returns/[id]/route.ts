// // src/app/api/returns/[id]/route.ts
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId, Document, Filter } from "mongodb";

type UpdateBody = {
  status?: "Pending" | "Completed" | "Rejected";
  customerName?: string;
  returnDate?: string;
  palletCount?: number;
  remarks?: string | null;
};

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } } // ✅ use context.params
) {
  try {
    const id = (await Promise.resolve(context.params)).id;
 // correctly accessed
    const body = (await req.json()) as UpdateBody;

    if (!id) {
      return NextResponse.json({ error: "Missing id in URL" }, { status: 400 });
    }

    // Build update object from allowed fields
    const updates: Partial<Document> = {};
    if (body.status !== undefined) {
      const allowed = ["Pending", "Completed", "Rejected"];
      if (!allowed.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updates.status = body.status;
    }
    if (body.customerName !== undefined) updates.customerName = body.customerName;
    if (body.returnDate !== undefined) updates.returnDate = body.returnDate;
    if (typeof body.palletCount === "number") updates.palletCount = body.palletCount;
    if (body.remarks !== undefined) updates.remarks = body.remarks;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("returnsDB"); // make sure this matches your POST/GET DB
    const collection = db.collection("returns");

    // Build filter: try ObjectId if valid, otherwise use string _id or orderId
    let filter: Filter<Document>;
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) } as Filter<Document>;
    } else {
      filter = { $or: [{ _id: id }, { orderId: id }] } as Filter<Document>;
    }

    const result = await collection.updateOne(filter, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Return not found" }, { status: 404 });
    }

    // Return the updated document
    const updatedDoc =
      (await collection.findOne(filter)) ||
      (await collection.findOne({ orderId: id }));

    return NextResponse.json({ success: true, updated: updatedDoc }, { status: 200 });
  } catch (err) {
    console.error("Error updating return:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = (await Promise.resolve(context.params)).id;
    if (!id) {
      return NextResponse.json({ error: "Missing id in URL" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("returnsDB");
    const collection = db.collection("returns");

    let filter: Filter<Document>;
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) } as Filter<Document>;
    } else {
      filter = { $or: [{ _id: id }, { orderId: id }] } as Filter<Document>;
    }

    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Return not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Return deleted" });
  } catch (err) {
    console.error("Error deleting return:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
