import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema({
  sku: { type: String },
  color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [String],
  description: { type: String },
  description_ar: { type: String },
  description_he: { type: String },
  stockStatus: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
    default: 'in_stock'
  }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ar: { type: String },
  name_he: { type: String },
  basePrice: { type: Number, required: false },
  image: { type: String, required: false },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  variants: [productVariantSchema],
  countries: {
    type: [String],
    default: ['uae'],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamps on save
productSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);