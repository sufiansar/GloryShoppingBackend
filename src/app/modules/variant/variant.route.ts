import { Router } from "express";
import { ProductController } from "../products/product.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";
import { VariantController } from "./variant.controller";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { createProductVariantSchema } from "./variant.validation";

const router = Router();
router.get("/", VariantController.getAllVariants);
router.get("/:sku", VariantController.getVariantBySku);
router.post(
  "/",
  multerUpload.array("images"),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createProductVariantSchema),
  VariantController.createdVariant
);
router.patch(
  "/:id",
  multerUpload.array("images"),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VariantController.updateVariant
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VariantController.deleteVariant
);

export const VariantRoutes = router;
