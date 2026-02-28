
import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

export const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);