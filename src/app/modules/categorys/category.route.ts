import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";

const router = Router();
router.get("/", auth(), CategoryController.getAllCategories);
router.get("/:id", auth(), CategoryController.getSingleCategory);
router.post("/", auth(), CategoryController.createCategory);
router.patch("/:id", auth(UserRole.ADMIN), CategoryController.updateCategory);
router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoryRoute = router;
