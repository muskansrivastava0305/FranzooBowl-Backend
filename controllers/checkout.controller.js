// controllers/checkout.controller.js
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { calculateTotals } from "../utils/calc.js";
import { sendWatiMessage } from "../services/watiService.js"; // 👈 WATI import

export async function startCheckout(req, res) {
  try {
    console.log("🧾 Incoming body:", req.body);

    const { cartId, customer } = req.body;
    if (!cartId || !customer?.name || !customer?.phone) {
      return res.status(400).json({ message: "cartId, customer.name, and customer.phone are required" });
    }

    // ✅ Proper populate with correct model names
    const cart = await Cart.findById(cartId)
      .populate({ path: "items.menuItem", model: "MenuItem" })
      .populate({ path: "addons.addon", model: "Addon" });

   console.log("🛒 Cart found:", !!cart, "Items:", cart?.items?.length || 0, "Addons:", cart?.addons?.length || 0);
    if (!cart || (!cart.items?.length && !cart.addons?.length)) {
      return res.status(400).json({ message: "Cart is empty or invalid" });
    }

    // ✅ Extract items safely
    const items = cart.items
      .filter(i => i.menuItem)
      .map(i => ({
        name: i.menuItem.name,
        price: i.menuItem.price,
        qty: i.qty,
      }));
      console.log("📦 Items array:", items);

    // ✅ Extract addons safely
    const addons = cart.addons
      .filter(a => a.addon)
      .map(a => ({
        name: a.addon.name,
        price: a.addon.price,
        qty: a.qty,
      }));
      console.log("➕ Addons array:", addons);

    // ✅ Calculate totals
    const totals = calculateTotals(items, addons);
    console.log("💰 Totals:", totals);

    // ✅ Create order
    const order = await Order.create({
      customer,
      items,
      addons,
      ...totals,
      status: "AWAITING_ADDRESS",
    });

    // ✅ WhatsApp message
    let msg = `🛒 *New Order*\n\n*Name:* ${customer.name}\n*Phone:* ${customer.phone}\n\n*Items:*\n`;
    items.forEach(it => {
      msg += `- ${it.name} x${it.qty} = ₹${it.price * it.qty}\n`;
    });
    if (addons.length) {
      msg += `\n*Add-ons:*\n`;
      addons.forEach(ad => {
        msg += `- ${ad.name} x${ad.qty} = ₹${ad.price * ad.qty}\n`;
      });
    }
    msg += `\n*Subtotal:* ₹${totals.subtotal}\n*Tax:* ₹${totals.taxAmount}\n*GST:* ₹${totals.gstAmount}\n*Total:* ₹${totals.grandTotal}\n\n📍 Please reply with your delivery address.`;

    // ✅ Send via WATI
    const response = await sendWatiMessage(customer.phone, msg);
    console.log("✅ WATI Response:", response);

    // ✅ WhatsApp link for frontend (optional)
    const whatsappUrl = `https://wa.me/${customer.phone}?text=${encodeURIComponent(msg)}`;

    // ✅ Respond to frontend
    res.json({ orderId: order._id, whatsappUrl, messageSent: true });
  } catch (err) {
    console.error("❌ Checkout error:", err);
    res.status(500).json({ message: "Checkout failed" });
  }
}
