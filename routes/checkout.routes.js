import { Router } from "express";
import { startCheckout } from "../controllers/checkout.controller.js"; 

const router = Router();

// ✅ Checkout route
router.post("/", startCheckout);

export default router;




