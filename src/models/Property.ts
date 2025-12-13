import mongoose, { Schema, Document } from 'mongoose';

export interface IUnit {
  unitName?: string;
  rentAmount?: number;
  deposit?: number;
  tenant?: mongoose.Types.ObjectId;
}

export interface IProperty extends Document {
  landlord: mongoose.Types.ObjectId;
  title: string;
  address?: string;
  description?: string;
  type: 'Apartment' | 'House' | 'Commercial' | 'Condo';
  status: 'Available' | 'Rented' | 'Maintenance';
  monthlyRent: number;
  size: number;
  amenities: string[];
  photos: string[];
  units: IUnit[];
  createdAt: Date;
}

const UnitSchema = new Schema({
  unitName: String,
  rentAmount: Number,
  deposit: Number,
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
});

const PropertySchema: Schema = new Schema({
  landlord: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  address: String,
  description: String,
  type: { type: String, enum: ['Apartment', 'House', 'Commercial', 'Condo'], default: 'Apartment' },
  status: { type: String, enum: ['Available', 'Rented', 'Maintenance'], default: 'Available' },
  monthlyRent: { type: Number, default: 0 },
  size: { type: Number, default: 0 },
  amenities: [String],
  photos: [String],
  units: [UnitSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

