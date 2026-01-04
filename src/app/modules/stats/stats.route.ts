import { Router } from "express";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";
import { StatsController } from "./stats.controller";

const router = Router();
router.get(
  "/orders-stats",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsController.getStats
);
router.get(
  "/best-products",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsController.getBestProduct
);
router.get(
  "/cancelled-products",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsController.cancelledProducts
);
router.get(
  "/user-stats",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsController.getUserStats
);
router.get(
  "/category-stats",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsController.getCategoryStats
);
router.get(
  "/per-category-stats",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsController.perCategoryStats
);
export const StatsRoute = router;
