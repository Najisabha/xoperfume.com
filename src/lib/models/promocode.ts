import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    discountType: { 
        type: String, 
        enum: ['percentage', 'fixed'], 
        default: 'percentage' 
    },
    expiresAt: { type: Date, required: true },
    minPurchaseAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number }, // Maximum discount amount for percentage discounts
    usageLimit: { type: Number }, // How many times the code can be used
    usageCount: { type: Number, default: 0 }, // How many times the code has been used
    isActive: { type: Boolean, default: true },
    description: { type: String },
}, {
    timestamps: true
});

export default mongoose.models.PromoCode || mongoose.model("PromoCode", promoCodeSchema);