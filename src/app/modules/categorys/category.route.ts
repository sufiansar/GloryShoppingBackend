import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getSingleCategory);
router.get("/slug/:slug", CategoryController.getCategoryBySlug);
router.get(
  "/slug/:slug/products",

  CategoryController.getAllProductByCategoryBySlug,
);
router.get(
  "/:id/products",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CategoryController.getProductByCetegory,
);
router.post(
  "/",
  auth(),
  multerUpload.array("images"),
  CategoryController.createCategory,
);
router.patch("/:id", auth(UserRole.ADMIN), CategoryController.updateCategory);
router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoryRoute = router;
