export const createOrder = async (req, res) => {
  try {
    const { name, phone, cartItems, totalAmount } = req.body;

    console.log("🛒 New order received:", req.body);

    // 👇 Future me yahan database save kar sakti ho
    // For now just send success message back
    res.status(201).json({
      success: true,
      message: "Order received successfully",
      data: { name, phone, cartItems, totalAmount },
    });
  } catch (error) {
    console.error("❌ Error in createOrder:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
