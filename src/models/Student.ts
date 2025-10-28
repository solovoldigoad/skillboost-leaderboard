import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  studentId: string;
  name: string;
  email: string;
  refreshTokenEncrypted: string;
  badgesCompleted: number;
  badges: Array<{
    badgeId: string;
    completedAt: Date;
    timeSpent: number;
  }>;
  totalTime: number;
  lastUpdated: Date;
  rank: number;
}

const StudentSchema = new Schema<IStudent>({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  refreshTokenEncrypted: { type: String },
  badgesCompleted: { type: Number, default: 0 },
  badges: [{
    badgeId: { type: String, required: true },
    completedAt: { type: Date },
    timeSpent: { type: Number }
  }],
  totalTime: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  rank: { type: Number }
}, {
  timestamps: true,
});

// Create indexes for efficient queries
StudentSchema.index({ badgesCompleted: -1, totalTime: 1, lastUpdated: -1 });
StudentSchema.index({ email: 1 });

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);