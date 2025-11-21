// models/OtpCode.js

import mongoose from 'mongoose';

const OtpCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Store the HASHED OTP here, not the plain code.
  hashedOtpCode: {
    type: String,
    required: true,
  },
  // The time until the OTP is no longer valid (e.g., 5 minutes from creation)
  expiresAt: {
    type: Date,
    required: true,
    // MongoDB TTL Index will automatically delete expired codes, which is a key security feature!
    index: { expires: '0s' }, 
  },
  // Rate limiting attempts against this specific code
  attemptCount: {
    type: Number,
    default: 0,
    max: 5, // Maximum allowed failed attempts before locking this code
  }
}, { timestamps: true });

const OtpCode = mongoose.models.OtpCode || mongoose.model('OtpCode', OtpCodeSchema);

export default OtpCode;