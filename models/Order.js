import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qty: Number,
}, { _id: false });

const OrderAddonSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qty: Number,
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  raw: String,
  flat: String,
  floor: String,
  landmark: String,
  city: String,
  pincode: String,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true }, // E.164 without '+' (e.g., 91XXXXXXXXXX)
  },
  items: [OrderItemSchema],
  addons: [OrderAddonSchema],
  subtotal: Number,
  taxAmount: Number,
  gstAmount: Number,
  grandTotal: Number,

  address: AddressSchema,

  paymentMethod: { type: String, enum: ['ONLINE', 'COD', null], default: null },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', null], default: null },
  status: { type: String, enum: ['CREATED', 'AWAITING_ADDRESS', 'AWAITING_PAYMENT_METHOD', 'AWAITING_PAYMENT', 'PENDING', 'CONFIRMED', 'CANCELLED'], default: 'CREATED' },

  razorpay: {
    paymentLinkId: String,
    paymentLinkShortUrl: String,
  },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
