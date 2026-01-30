import { Router } from "express";
import { CartController } from "./cart.controller";

const router = Router();
router.get("/", CartController.getCart);
router.get("/count", CartController.getCartCount);
router.post("/", CartController.addToCart);
router.patch("/", CartController.updateCartItem);
router.delete("/:productId", CartController.removeCartItem);

export const CartRouter = router;
