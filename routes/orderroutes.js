import express from "express";
import { createOrder } from "../controllers/order.controller.js";

const router = express.Router();

// ✅ Route to handle new order
router.post("/orders", createOrder);

export default router;
