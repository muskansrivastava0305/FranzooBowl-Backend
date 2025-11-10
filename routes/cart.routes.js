import express from "express";
import { createCart, getCart, addOrUpdateItem, addOrUpdateAddon } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", createCart);                      // Create new cart
router.get("/:cartId", getCart);                   // Get cart
router.post("/:cartId/items", addOrUpdateItem);    // Add / update item
router.post("/:cartId/addons", addOrUpdateAddon);     // newly added

export default router;
// export default router;




