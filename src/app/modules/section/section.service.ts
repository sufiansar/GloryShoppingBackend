import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { ISection } from "./section.interface";
const createSection = async (section: ISection) => {
  const isVisible =
    section.isVisible === "true"
      ? true
      : section.isVisible === "false"
        ? false
        : undefined;
  const data = {
    title: section.title || undefined,
    description: section.description || undefined,
    images: section.images,
    type: section.type ?? undefined,
    icons: section.icons || undefined,
    link: section.link || undefined,
    ctaText: section.ctaText || undefined,
    isVisible,
    primaryColor: section.primaryColor || undefined,
    secondaryColor: section.secondaryColor || undefined,
  };

  const newSection = await prisma.section.create({
    data,
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
    prisma.section.findMany({
      ...prismaQuery,
      orderBy: { createdAt: "desc" },
    }),
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

  let isVisible: boolean | null | undefined;
  if (sectionData.isVisible === "true") {
    isVisible = true;
  } else if (sectionData.isVisible === "false") {
    isVisible = false;
  } else if (
    typeof sectionData.isVisible === "boolean" ||
    sectionData.isVisible === null ||
    sectionData.isVisible === undefined
  ) {
    isVisible = sectionData.isVisible;
  }

  const updateData = {
    ...sectionData,
    isVisible,
  };

  const updatedSection = await prisma.section.update({
    where: { id },
    data: updateData,
  });

  if (sectionData.images && existingSection.images) {
    const imagesToDelete = existingSection.images.filter(
      (img) => !sectionData.images?.includes(img),
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
