import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressLog extends Document {
  studentId: string;
  badgeId: string;
  completedAt: Date;
  timeSpent: number;
}

const ProgressLogSchema = new Schema<IProgressLog>({
  studentId: { type: String, required: true },
  badgeId: { type: String, required: true },
  completedAt: { type: Date, required: true },
  timeSpent: { type: Number, required: true }
}, {
  timestamps: true,
});

// Create indexes for efficient queries
ProgressLogSchema.index({ studentId: 1, badgeId: 1 });
ProgressLogSchema.index({ completedAt: -1 });

export const ProgressLog = mongoose.models.ProgressLog || mongoose.model<IProgressLog>('ProgressLog', ProgressLogSchema);