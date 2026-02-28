import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ar: { type: String },
  name_he: { type: String },
  slug: { type: String, required: true, unique: true },
  description: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isSubcategory: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Add timestamps and virtuals options at schema level
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Remove the previous virtual setup and use a different approach
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
  justOne: false // This ensures it returns an array of subcategories
});

// Update timestamps on save
categorySchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

// Add an index for better query performance
categorySchema.index({ parentId: 1 });

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);