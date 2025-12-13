import mongoose, { Schema, Document } from 'mongoose';

export interface IRentPayment extends Document {
  property: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  amount: number;
  deposit?: number;
  dueDate: Date;
  paid: boolean;
  paidAt?: Date;
  createdAt: Date;
}

const RentPaymentSchema: Schema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  amount: { type: Number, required: true },
  deposit: Number,
  dueDate: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  paidAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RentPayment || mongoose.model<IRentPayment>('RentPayment', RentPaymentSchema);

