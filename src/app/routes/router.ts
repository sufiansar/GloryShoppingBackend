import express from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { CategoryRoute } from "../modules/categorys/category.route";
import path from "path";
import { BrandRoutes } from "../modules/brand/brand.route";
import { ProductRoutes } from "../modules/products/product.route";
import { VariantRoutes } from "../modules/variant/variant.route";
import { SkinRoutes } from "../modules/skin/skin.route";
import { IngredientRoutes } from "../modules/Ingredient/Ingredient.route";
import { SectionRoute } from "../modules/section/section.route";
import { AddressRoute } from "../modules/address/address.route";
import { ReviewRoute } from "../modules/review/review.route";
import { ContactRoutes } from "../modules/contact/contact.route";
import { CartRouter } from "../modules/cart/cart.route";
import { OrderRoute } from "../modules/order/order.route";
import { StatsRoute } from "../modules/stats/stats.route";

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
  {
    path: "/ingredient",
    route: IngredientRoutes,
  },
  {
    path: "/section",
    route: SectionRoute,
  },
  {
    path: "/review",
    route: ReviewRoute,
  },
  {
    path: "/address",
    route: AddressRoute,
  },

  {
    path: "/cart",
    route: CartRouter,
  },
  {
    path: "/order",
    route: OrderRoute,
  },
  {
    path: "/contact",
    route: ContactRoutes,
  },
  {
    path: "/stats",
    route: StatsRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
