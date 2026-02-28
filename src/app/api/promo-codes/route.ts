
import { NextRequest, NextResponse } from "next/server";
import PromoCode from "@/lib/models/promocode";
import connectDB from "@/lib/db";

export async function GET() {
  await connectDB();
  const promoCodes = await PromoCode.find({});
  return NextResponse.json(promoCodes);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newPromo = await PromoCode.create(data);
  return NextResponse.json(newPromo);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const updated = await PromoCode.findByIdAndUpdate(data._id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();
  await PromoCode.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}