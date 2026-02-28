import mongoose from 'mongoose';
import { genSalt, hash } from 'bcryptjs';
import { IUser } from '@/types';

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  aptSuite: String,
  city: String,
  country: String,
  emirates: String,
  phone: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  addresses: [addressSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

// Update timestamps on save
userSchema.pre("save", function(next) {
  this.updatedAt = new Date()
  next()
})

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);