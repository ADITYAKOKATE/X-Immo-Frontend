import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  property: mongoose.Types.ObjectId;
  tenant?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const TicketSchema: Schema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  attachments: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

TicketSchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

