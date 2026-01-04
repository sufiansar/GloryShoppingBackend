import { Router } from "express";
import { OrderController } from "./order.controller";
import auth, { optionalAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";

const router = Router();
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getALlOrders
);
router.get("/:id", auth(), OrderController.getOrderBYId);
router.delete("/:id", auth(), OrderController.orderDelete);
router.patch("/cancel/:id", auth(), OrderController.orderCancle);
router.post("/", optionalAuth(), OrderController.createOrder);
router.patch(
  "/:id/status",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.updateOrderStatus
);

export const OrderRoute = router;
