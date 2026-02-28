import { Session } from "@/lib/models/session"
import { UAParser } from "ua-parser-js"

export class SessionService {
  static async cleanup() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Session.updateMany(
      { lastAccessed: { $lt: thirtyDaysAgo }, isActive: true },
      { isActive: false, revokedAt: new Date() }
    );
  }

  static async getSessionsWithUser(filter = {}) {
    return Session.aggregate([
      { $match: filter },
      {
        $project: {
          userId: 1,
          userEmail: 1,
          userName: 1,
          deviceName: 1,
          userAgent: 1,
          ipAddress: 1,
          lastAccessed: 1,
          isActive: 1,
          createdAt: 1,
          revokedAt: 1,
          sessionToken: 1
        }
      },
      { $sort: { lastAccessed: -1 } }
    ]);
  }

  static createDeviceName(userAgent: string) {
    const ua = new UAParser(userAgent).getResult();
    return `${ua.browser.name || 'Unknown'} on ${ua.os.name || 'Unknown'}`;
  }

  static async revokeSession(sessionId: string) {
    return Session.findByIdAndUpdate(sessionId, {
      isActive: false,
      revokedAt: new Date()
    });
  }

  static async updateSession(filter: any, update: any, options: any = {}) {
    return Session.findOneAndUpdate(filter, update, { 
      new: true,
      ...options
    });
  }
}