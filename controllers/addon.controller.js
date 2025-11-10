import Addon from '../models/Addon.js';

export async function listAddons(req, res) {
  const addons = await Addon.find({ available: true }).sort({ createdAt: -1 });
  res.json(addons);
}
