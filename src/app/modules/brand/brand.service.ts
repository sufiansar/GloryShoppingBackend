import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSlug } from "../../utility/slugGenerate";
import { ICreateBrand } from "./brand.interface";

const createBrand = async (brand: Partial<ICreateBrand>) => {
  if (!brand.name) {
    throw new Error("Brand name is required");
  }

  const slugGenerate = generateSlug(brand.name);

  const newBrand = {
    name: brand.name,
    slug: slugGenerate,
    country: brand.country || null,
    logoUrl: brand.logoUrl || null,
  };

  const brandCreated = await prisma.brand.create({
    data: newBrand,
  });

  return brandCreated;
};

const getAllBrands = async (query: Record<string, string>) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .filter()
    .search(["name"])
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [brands, meta] = await Promise.all([
    prisma.brand.findMany(prismaQuery),
    prismaQueryBuilder.getMeta(prisma.brand),
  ]);

  return {
    data: brands,
    meta,
  };
};

const getBrandById = async (id: string) => {
  const brand = await prisma.brand.findUnique({
    where: { id },
  });
  return brand;
};

const updateBrand = async (id: string, brandData: any) => {
  const existigBrand = await prisma.brand.findUnique({ where: { id } });
  if (brandData.name) {
    const updatedSlug = generateSlug(brandData.name);
    brandData.slug = updatedSlug;
  }

  const updatedBrand = await prisma.brand.update({
    where: { id },
    data: brandData,
  });
  if (brandData.logoUrl && existigBrand?.logoUrl) {
    await deleteImageFromCLoudinary(existigBrand.logoUrl);
  }
  return updatedBrand;
};

const deleteBrand = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) {
      throw new Error("Brand not found");
    }

    if (brand.logoUrl) {
      await deleteImageFromCLoudinary(brand.logoUrl);
    }

    const deletedBrand = await prisma.brand.delete({
      where: { id },
    });
    return deletedBrand;
  });
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
