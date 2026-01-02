import { Router } from "express";
import { CartController } from "./cart.controller";

const router = Router();
router.post("/", CartController.addToCart);
router.patch("/", CartController.updateCartItem);
router.delete("/:variantId", CartController.removeCartItem);

export const CartRouter = router;
