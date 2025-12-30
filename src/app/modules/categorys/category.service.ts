import { includes } from "zod";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSlug } from "../../utility/slugGenerate";
import { ICreateCategory } from "./category.interface";

const createCategory = async (categoryData: ICreateCategory) => {
  if (!categoryData.images) {
    categoryData.images = [];
  }
  const createSlug = generateSlug(categoryData.name);
  categoryData.slug = createSlug;
  const category = {
    slug: categoryData.slug,
    name: categoryData.name,
    description: categoryData.description || "",
    images: categoryData.images || [],
  };
  const result = await prisma.category.create({
    data: category,
  });
  return result;
};

const getAllCategories = async (query: Record<string, string>) => {
  const prismaQuery = new PrismaQueryBuilder(query)
    .filter()
    .search(["name", "description"])
    .sort()
    .paginate()
    .build();

  const categories = await prisma.category.findMany({
    ...prismaQuery,
    include: {
      products: true,
    },
  });

  return categories;
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
  return category;
};

const updateCategory = async (
  id: string,
  categoryData: Partial<ICreateCategory>
) => {
  if (categoryData.name) {
    const updatedSlug = generateSlug(categoryData.name);
    categoryData.slug = updatedSlug;
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: categoryData,
  });

  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  const deletedCategory = await prisma.category.delete({
    where: { id },
  });
  return deletedCategory;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
