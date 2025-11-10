import Cart from "../models/Cart.js";

// ✅ Create Empty Cart
export const createCart = async (req, res) => {
  const cart = new Cart({ items: [], addons: [] });
  await cart.save();
  res.json({ cartId: cart._id });
};

// ✅ Get Cart by ID
export const getCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId)
      .populate("items.menuItem")
      .populate("addons.addon");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// ✅ Add or Update Item
export const addOrUpdateItem = async (req, res) => {
  console.log("Received body:", req.body);
  const { menuItem, qty } = req.body;
  const { cartId } = req.params;

  if (!menuItem || qty == null) {
    return res.status(400).json({ message: "menuItem and qty are required" });
  }

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existing = cart.items.find(i => i.menuItem.toString() === menuItem);

    if (existing) {
      if (qty <= 0) {
        // remove if qty <= 0
        cart.items = cart.items.filter(i => i.menuItem.toString() !== menuItem);
      } else {
        // ✅ update qty correctly
        existing.qty = qty;
      }
    } else if (qty > 0) {
      // ✅ add new item
      cart.items.push({ menuItem, qty });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cartId)
      .populate("items.menuItem")
      .populate("addons.addon");

    res.json(updatedCart);
  } catch (err) {
    console.error("Item update error:", err);
    res.status(500).json({ message: "Failed to update item" });
  }
};


// ✅ Add or Update Addon
export const addOrUpdateAddon = async (req, res) => {
  const { addonId, qty } = req.body;
  const { cartId } = req.params;

  if (!addonId || qty == null) {
    return res.status(400).json({ message: "addonId and qty are required" });
  }

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existing = cart.addons.find(a => a.addon.toString() === addonId);

    if (existing) {
      if (existing.qty <= 0) {
        cart.addons = cart.addons.filter(a => a.addon.toString() !== addonId);
      }
    } else if (qty > 0) {
      cart.addons.push({ addon: addonId, qty });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cartId)
      .populate("items.menuItem")
      .populate("addons.addon");

    res.json(updatedCart);
  } catch (err) {
    console.error("Addon update error:", err);
    res.status(500).json({ message: "Failed to update addon" });
  }
};
