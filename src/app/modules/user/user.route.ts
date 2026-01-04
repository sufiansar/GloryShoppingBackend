import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";

const router = Router();
router.get("/my-profile", auth(), UserController.getMyProfile);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/create-user", UserController.createUser);
router.patch("/:id", UserController.updateUser);
router.patch(
  "/role-update/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.userRoleUpdate
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.deleteUser
);

export const UserRoute = router;
