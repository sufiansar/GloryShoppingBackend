import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { ISection } from "./section.interface";

const createSection = async (section: ISection) => {
  const data = {
    title: section.title,
    description: section.description,
    images: section.images,
    type: section.type ?? undefined,
    icons: section.icons,
    link: section.link,
    ctaText: section.ctaText,
    isVisible: section.isVisible,
    primaryColor: section.primaryColor,
    secondaryColor: section.secondaryColor,
  };
  const newSection = await prisma.section.create({
    data: data,
  });

  return newSection;
};

const getAllSections = async (query: Record<string, string>) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [sections, meta] = await Promise.all([
    prisma.section.findMany(prismaQuery),
    prismaQueryBuilder.getMeta(prisma.section),
  ]);

  return {
    data: sections,
    meta,
  };
};

const getSectionById = async (id: string) => {
  const section = await prisma.section.findUnique({
    where: { id },
  });
  return section;
};
const updateSection = async (id: string, sectionData: Partial<ISection>) => {
  const existingSection = await prisma.section.findUnique({
    where: { id },
  });

  if (!existingSection) {
    throw new Error("Section not found");
  }

  const updatedSection = await prisma.section.update({
    where: { id },
    data: sectionData,
  });

  if (sectionData.images && existingSection.images) {
    const imagesToDelete = existingSection.images.filter(
      (img) => !sectionData.images?.includes(img)
    );
    for (const imageUrl of imagesToDelete) {
      await deleteImageFromCLoudinary(imageUrl);
    }
  }

  return updatedSection;
};

const deleteSection = async (id: string) => {
  const existingSection = await prisma.section.findUnique({
    where: { id },
  });

  if (!existingSection) {
    throw new Error("Section not found");
  }

  await prisma.section.delete({
    where: { id },
  });

  for (const imageUrl of existingSection.images) {
    await deleteImageFromCLoudinary(imageUrl);
  }
};

export const SectionService = {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
};
