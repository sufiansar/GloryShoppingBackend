import express from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { CategoryRoute } from "../modules/categorys/category.route";
import path from "path";
import { BrandRoutes } from "../modules/brand/brand.route";
import { ProductRoutes } from "../modules/products/product.route";
import { VariantRoutes } from "../modules/variant/variant.route";
import { SkinRoutes } from "../modules/skin/skin.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/category",
    route: CategoryRoute,
  },
  {
    path: "/brand",
    route: BrandRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/variant",
    route: VariantRoutes,
  },
  {
    path: "/skin",
    route: SkinRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
