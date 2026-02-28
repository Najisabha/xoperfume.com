import { ISession } from "@/types";
import mongoose from "mongoose"

// Add static methods to the interface
interface SessionModel extends mongoose.Model<ISession> {
  cleanup(): Promise<void>;
}

const sessionSchema = new mongoose.Schema<ISession, SessionModel>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  revokedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deviceName: {
    type: String,
    required: true,
  },
  sessionToken: {
    type: String,
    unique: true,
    sparse: true
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  }
})

// Update lastAccessed on activity
sessionSchema.methods.updateLastAccessed = async function() {
  this.lastAccessed = new Date();
  return this.save();
}

// Fix the static method definition
sessionSchema.static('cleanup', async function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await this.updateMany(
    { 
      lastAccessed: { $lt: thirtyDaysAgo },
      isActive: true 
    },
    { 
      isActive: false,
      revokedAt: new Date()
    }
  );
});

// Update timestamps on save
sessionSchema.pre("save", function(next) {
  this.updatedAt = new Date()
  next()
})

export const Session = (mongoose.models.Session || mongoose.model<ISession, SessionModel>("Session", sessionSchema)) as unknown as SessionModel;