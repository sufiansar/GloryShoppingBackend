import { Router } from "express";
import { BrandController } from "./brand.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.get("/", BrandController.getAllBrands);
router.get("/:id", BrandController.getBrandById);
router.get("/slug/:slug", BrandController.getBrandBySlugWithProducts);
router.post(
  "/",
  multerUpload.single("logo"),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  BrandController.createBrand,
);
router.patch(
  "/:id",
  multerUpload.single("logo"),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  BrandController.updateBrand,
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  BrandController.deleteBrand,
);
export const BrandRoutes = router;
