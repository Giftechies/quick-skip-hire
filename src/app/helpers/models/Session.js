import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userRole: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    ipAddress: {
      type: String,
      default: "unknown",
    },

    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

const Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session;
