import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true },
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
