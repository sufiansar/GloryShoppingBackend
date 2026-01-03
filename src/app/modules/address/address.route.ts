import { Router } from "express";
import { AddressController } from "./address.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma";

const router = Router();
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AddressController.getAllAddresses
);
router.get("/:id", AddressController.getAddressById);
router.post("/", AddressController.createAddress);
router.patch("/:id", AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);

export const AddressRoute = router;
