import connectDB from "@/lib/db";
import promocode from "@/lib/models/promocode";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    await connectDB();
    const { code, orderAmount } = await req.json();

    try {
        const promoCode = await promocode.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!promoCode) {
            return NextResponse.json({ 
                valid: false, 
                message: "Invalid or expired promo code" 
            });
        }

        // Move usage limit check to the top
        if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
            await promocode.findByIdAndUpdate(promoCode._id, { isActive: false });
            return NextResponse.json({ 
                valid: false, 
                message: "This promo code has reached its maximum usage limit" 
            });
        }

        if (orderAmount < promoCode.minPurchaseAmount) {
            return NextResponse.json({ 
                valid: false, 
                message: `Minimum purchase amount is $${promoCode.minPurchaseAmount}` 
            });
        }

        // Calculate actual discount
        let discountAmount = promoCode.discountType === 'percentage'
            ? (orderAmount * (promoCode.discount / 100))
            : promoCode.discount;

        // Apply max discount if set
        if (promoCode.maxDiscount && discountAmount > promoCode.maxDiscount) {
            discountAmount = promoCode.maxDiscount;
        }

        return NextResponse.json({
            valid: true,
            promoCode: {
                ...promoCode.toObject(),
                calculatedDiscount: discountAmount
            }
        });
    } catch (error) {
        console.error('Promo code validation error:', error);
        return NextResponse.json(
            { valid: false, message: "Failed to validate promo code" },
            { status: 500 }
        );
    }
}