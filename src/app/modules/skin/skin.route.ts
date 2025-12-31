import { Router } from "express";
import { SkinController } from "./skin.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";

const router = Router();
router.get(
  "/skin-concerns",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.getAllSkinConcerns
);
router.get(
  "/skin-concerns/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.getSkinConcernById
);
router.post(
  "/skin-concerns",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.createSkinConcern
);
router.post(
  "/addProductSkin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.addProductSkin
);
router.patch(
  "/skin-concerns/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.updateSkinConcern
);
router.delete(
  "/skin-concerns/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.deleteSkinConcern
);

router.get(
  "/skin-types",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.getAllSkinTypes
);
router.get(
  "/skin-types/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.getSkinTypeById
);
router.post(
  "/skin-types",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.createSkinType
);
router.patch(
  "/skin-types/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.updateSkinType
);
router.delete(
  "/skin-types/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SkinController.deleteSkinType
);

export const SkinRoutes = router;
