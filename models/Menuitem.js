import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  available: { type: Boolean, default: true }

}, { timestamps: true }
);

const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", menuSchema);

export default MenuItem;

