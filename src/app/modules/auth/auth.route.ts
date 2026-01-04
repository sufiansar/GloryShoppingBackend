import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.loginUser);
router.post("/logout", AuthController.logOUtUser);
// router.post("/register", AuthController.registerUser);
// router.post("/refresh-token", AuthController.refreshToken);
// router.post("/reset-password", AuthController.resetPassword);
router.patch("/change-password", AuthController.changeUserPassword);

// Add any additional routes as needed
// router.get("/profile", authMiddleware, AuthController.getProfile);
export const AuthRoute = router;
