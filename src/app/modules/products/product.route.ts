import { Router } from "express";
import { ProductController } from "./product.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.patch(
  "/:id",
  multerUpload.single("thumbleImage"),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProductController.updateProduct
);

router.post(
  "/",
  multerUpload.single("thumbleImage"),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProductController.createProduct
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
