import { z } from "zod";

export const createProductVariantSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID" }),

  //   sku: z.string().min(3, "SKU is required").max(50, "SKU is too long"),

  size: z.string().min(1, "Size is required").max(20),

  //   images: z
  //     .array(z.string().url("Invalid image URL"))
  //     .min(1, "At least one image is required"),
  price: z.preprocess((val) => {
    if (val === undefined || val === "") return undefined;
    return Number(val);
  }, z.number().positive("Price must be greater than 0").optional()),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative")
    .optional(),

  lowStockThreshold: z.coerce.number().int().nonnegative().optional(),
});
