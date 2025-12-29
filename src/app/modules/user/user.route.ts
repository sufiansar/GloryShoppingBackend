import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/create-user", UserController.createUser);

export const UserRoute = router;
