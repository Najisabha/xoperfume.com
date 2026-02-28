import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    selectedVariant: {
      _id: String,
      sku: String,
      color: { type: mongoose.Schema.Types.Mixed },
      price: Number,
      stock: Number,
      images: [String],
      stockStatus: {
        type: String,
        enum: ['in_stock', 'low_stock', 'out_of_stock']
      }
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    aptSuite: String,
    city: String,
    country: String,
    emirates: String,
    phone: String
  },
  message: String,
  customerEmail: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentIntentId: {
    type: String
  },
  initiatorEmail: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  promoCode: {
    code: String,
    discountType: String,
    discountValue: Number, // original discount value (percentage or fixed)
    calculatedDiscount: Number, // actual amount discounted
    originalAmount: Number, // amount before discount
    finalAmount: Number, // amount after discount
  },
  subtotalAmount: Number, // amount before discount
})

// Update timestamps on save
orderSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)