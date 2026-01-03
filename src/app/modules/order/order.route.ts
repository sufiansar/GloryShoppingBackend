import { Router } from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";

const router = Router();
router.post("/", OrderController.createOrder);
router.patch(
  "/:id/status",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.updateOrderStatus
);

export const OrderRoute = router;
