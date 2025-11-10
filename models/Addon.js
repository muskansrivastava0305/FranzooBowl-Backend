import mongoose from 'mongoose';

const AddonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Addon', AddonSchema);
