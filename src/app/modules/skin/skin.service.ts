import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";

const createSkinConcern = async (data: { name: string }) => {
  const skinConcern = await prisma.skinConcern.create({
    data,
  });
  return skinConcern;
};

const getAllSkinConcerns = async (query: Record<string, string>) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();
  const [skinConcerns, meta] = await Promise.all([
    prisma.skinConcern.findMany({
      ...prismaQuery,
      orderBy: { createdAt: "desc" },
    }),
    prismaQueryBuilder.getMeta(prisma.skinConcern),
  ]);

  return {
    data: skinConcerns,
    meta,
  };
};

const getSkinConcernById = async (id: string) => {
  const skinConcern = await prisma.skinConcern.findUnique({
    where: { id },
  });
  return skinConcern;
};

const updateSkinConcern = async (
  id: string,
  skinConcernData: { name?: string },
) => {
  const existingSkinConcern = await prisma.skinConcern.findUnique({
    where: { id },
  });

  if (!existingSkinConcern) {
    throw new Error("Skin Concern not found");
  }

  const updatedSkinConcern = await prisma.skinConcern.update({
    where: { id },
    data: skinConcernData,
  });

  return updatedSkinConcern;
};

const deleteSkinConcern = async (id: string) => {
  const existingSkinConcern = await prisma.skinConcern.findUnique({
    where: { id },
  });

  if (!existingSkinConcern) {
    throw new Error("Skin Concern not found");
  }

  await prisma.skinConcern.delete({
    where: { id },
  });

  return { message: "Skin Concern deleted successfully" };
};

const createSkinType = async (data: { name: string }) => {
  const skinType = await prisma.skinType.create({
    data,
  });
  return skinType;
};

const getAllSkinTypes = async (query: Record<string, string>) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();
  const [skinTypes, meta] = await Promise.all([
    prisma.skinType.findMany({
      ...prismaQuery,
      orderBy: { createdAt: "desc" },
    }),
    prismaQueryBuilder.getMeta(prisma.skinType),
  ]);

  return {
    data: skinTypes,
    meta,
  };
};
const getSkinTypeById = async (id: string) => {
  const skinType = await prisma.skinType.findUnique({
    where: { id },
  });
  return skinType;
};

const updateSkinType = async (id: string, skinTypeData: { name?: string }) => {
  const existingSkinType = await prisma.skinType.findUnique({
    where: { id },
  });

  if (!existingSkinType) {
    throw new Error("Skin Type not found");
  }

  const updatedSkinType = await prisma.skinType.update({
    where: { id },
    data: skinTypeData,
  });

  return updatedSkinType;
};

const deleteSkinType = async (id: string) => {
  const existingSkinType = await prisma.skinType.findUnique({
    where: { id },
  });

  if (!existingSkinType) {
    throw new Error("Skin Type not found");
  }

  await prisma.skinType.delete({
    where: { id },
  });

  return null;
};

const addProductSkin = async (
  productId: string,
  skinConcernIds: string[],
  skinTypeIds: string[],
) => {
  if (!productId || !skinConcernIds?.length || !skinTypeIds?.length) {
    throw new Error("productId, skinConcernIds, and skinTypeIds are required");
  }

  return await prisma.$transaction(async (tx: any) => {
    const productSkinConcern = await tx.productSkinConcern.createMany({
      data: skinConcernIds.map((id) => ({
        productId,
        skinConcernId: id,
      })),
      skipDuplicates: true,
    });

    const productSkinType = await tx.productSkinType.createMany({
      data: skinTypeIds.map((id) => ({
        productId,
        skinTypeId: id,
      })),
      skipDuplicates: true,
    });

    return { productSkinConcern, productSkinType };
  });
};

export const SkinService = {
  createSkinConcern,
  createSkinType,
  getAllSkinConcerns,
  getAllSkinTypes,
  getSkinConcernById,
  getSkinTypeById,
  updateSkinConcern,
  updateSkinType,
  deleteSkinConcern,
  deleteSkinType,
  addProductSkin,
};
