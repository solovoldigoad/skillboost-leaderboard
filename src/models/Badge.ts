import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  badgeId: string;
  title: string;
  estimatedDuration: number;
}

const BadgeSchema = new Schema<IBadge>({
  badgeId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  estimatedDuration: { type: Number, required: true }
}, {
  timestamps: true,
});

// Create indexes for efficient queries
BadgeSchema.index({ badgeId: 1 });
BadgeSchema.index({ title: 1 });

export const Badge = mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);