import { Router } from "express";
import { SectionController } from "./section.controller";
import auth from "../../middlewares/checkAuth";

import { multerUpload } from "../../config/multer.config";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", SectionController.getAllSections);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SectionController.getSectionById,
);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  multerUpload.array("images"),
  SectionController.createSection,
);
router.patch(
  "/:id",
  multerUpload.array("images"),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SectionController.updateSection,
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  SectionController.deleteSection,
);

export const SectionRoute = router;
