import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { paginationHelper } from "../../utility/paginationField";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { IngredientSearchAbleFields } from "./ingrediant.constant";
import { IIngredient } from "./Ingredient.interface";

const createIngredient = async (data: IIngredient) => {
  const ingredient = await prisma.ingredient.create({
    data: {
      name: data.name,
      description: data.description ?? undefined,
      benefits: data.benefits ?? undefined,
      sideEffects: data.sideEffects ?? undefined,
      usage: data.usage ?? undefined,
      precautions: data.precautions ?? undefined,
      isActive: data.isActive ?? true,
      safetyLevel: data.safetyLevel || "SAFE",
    },
  });

  return ingredient;
};

const getAllIngredients = async (
  filters: Record<string, any>,
  options: Record<string, any>,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const andConditions: Prisma.IngredientWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: IngredientSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.IngredientWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const ingredients = await prisma.ingredient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
  });

  const total = await prisma.ingredient.count({
    where: whereConditions,
  });

  return {
    data: ingredients,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getIngredientById = async (id: string) => {
  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
  });
  return ingredient;
};
const updateIngredient = async (
  id: string,
  ingredientData: Partial<IIngredient>,
) => {
  const existingIngredient = await prisma.ingredient.findUnique({
    where: { id },
  });

  if (!existingIngredient) {
    throw new Error("Ingredient not found");
  }

  const { products, ...scalarData } = ingredientData;

  const updatedIngredient = await prisma.ingredient.update({
    where: { id },
    data: scalarData,
  });

  return updatedIngredient;
};

const deleteIngredient = async (id: string) => {
  const existingIngredient = await prisma.ingredient.findUnique({
    where: { id },
  });

  if (!existingIngredient) {
    throw new Error("Ingredient not found");
  }

  await prisma.ingredient.delete({
    where: { id },
  });

  return { message: "Ingredient deleted successfully" };
};

const joinIngredientsToProduct = async (
  ingredientIds: string[] | string,
  productId: string,
) => {
  const ids = Array.isArray(ingredientIds) ? ingredientIds : [ingredientIds];

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const ingredientCount = await prisma.ingredient.count({
    where: { id: { in: ids } },
  });

  if (ingredientCount !== ids.length) {
    throw new Error("One or more ingredients not found");
  }

  await prisma.$transaction(
    ids.map((ingredientId) =>
      prisma.productIngredient.upsert({
        where: { productId_ingredientId: { productId, ingredientId } },
        create: { productId, ingredientId },
        update: {},
      }),
    ),
  );
};

export const IngredientService = {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  joinIngredientsToProduct,
};
