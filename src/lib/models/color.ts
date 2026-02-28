import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    name_ar: { type: String },
    name_he: { type: String },
    hex: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Update timestamps on save
colorSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Color = mongoose.models.Color || mongoose.model('Color', colorSchema);
