import { NextResponse } from "next/server";
import PromoCode from "@/lib/models/promocode";
import connectDB from "@/lib/db";

export async function GET() {
  await connectDB();

  try {
    // Get basic stats
    const [totalCodes, activeCodes] = await Promise.all([
      PromoCode.countDocuments(),
      PromoCode.countDocuments({ isActive: true }),
    ]);

    // Calculate total usage and discounts
    const codes = await PromoCode.find({});
    const totalUsage = codes.reduce((sum, code) => sum + (code.usageCount || 0), 0);
    const totalDiscounts = codes.reduce((sum, code) => {
      const discountAmount = code.discountType === 'percentage' 
        ? (code.discount / 100) * (code.minPurchaseAmount || 0) 
        : code.discount;
      return sum + (discountAmount * (code.usageCount || 0));
    }, 0);

    // Generate mock usage data for the chart (last 7 days)
    const usageData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString(),
        usage: Math.floor(Math.random() * 10), // Replace with actual usage data
      };
    }).reverse();

    return NextResponse.json({
      stats: {
        totalCodes,
        activeCodes,
        totalUsage,
        totalDiscounts,
      },
      usageData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
