import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  landlord: mongoose.Types.ObjectId;
  property?: mongoose.Types.ObjectId; // Link to Property
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  employmentStatus: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Student' | 'Retired';
  monthlyIncome: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  notes?: string;
  status: 'active' | 'vacant' | 'notice' | 'evicted';
  documents: {
    name: string;
    url: string;
    uploadedAt?: Date;
  }[];
  leaseStart?: Date;
  leaseEnd?: Date;
  createdAt: Date;
}

const TenantSchema: Schema = new Schema({
  landlord: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property' }, // Link to Property
  name: { type: String, required: true },
  email: String,
  phone: String,
  profilePhoto: String,
  employmentStatus: {
    type: String,
    enum: ['Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired'],
    default: 'Employed'
  },
  monthlyIncome: { type: Number, default: 0 },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  notes: String,
  status: { type: String, enum: ['active', 'vacant', 'notice', 'evicted'], default: 'active' },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  leaseStart: Date,
  leaseEnd: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

