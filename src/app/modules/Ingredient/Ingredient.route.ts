import { Router } from "express";
import { IngredientController } from "./Ingredient.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  IngredientController.getAllIngredients,
);
router.get("/:id", IngredientController.getIngredientById);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  IngredientController.createIngredient,
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  IngredientController.updateIngredient,
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  IngredientController.deleteIngredient,
);
router.post(
  "/join",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  IngredientController.joinIngredientsToProduct,
);

export const IngredientRoutes = router;
