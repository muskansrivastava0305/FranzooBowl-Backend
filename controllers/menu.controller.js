import MenuItem from '../models/Menuitem.js';

export async function listMenu(req, res) {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 }); // 👈 filter hata diya
     console.log("👉 Menu items from DB:", items.length);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
}
