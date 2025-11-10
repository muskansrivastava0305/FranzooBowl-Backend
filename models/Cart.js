// models/Cart.js
import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  menuItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "MenuItem", 
    required: true 
  },
  qty: { type: Number, default: 1, min: 1 }
}, { _id: false });

const CartAddonSchema = new mongoose.Schema({
  addon: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Addon",   // 👈 Addon model ka naam
    required: true 
  },
  qty: { type: Number, default: 1, min: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  items: [CartItemSchema],
  addons: [CartAddonSchema],   // 👈 ab addons bhi allowed hai
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);
