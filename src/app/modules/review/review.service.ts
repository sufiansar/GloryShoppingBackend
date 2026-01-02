import { UserRole } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { IReview } from "./review.interface";

const createReview = async (data: Partial<IReview>) => {
  const userExists = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!userExists) {
    throw new Error("User not found");
  }

  const productExists = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!productExists) {
    throw new Error("Product not found");
  }
  const review = await prisma.review.create({
    data: {
      productId: data.productId as string,
      userId: userExists.id as string,
      rating: data.rating as number,
      comment: data.comment,
    },
  });
  return review;
};

const getReviewsByProductId = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return reviews;
};

const getALlReviews = async (query: Record<string, string>) => {
  const prismaQuery = new PrismaQueryBuilder(query).filter().sort().paginate();

  const prismaQueryBuilt = prismaQuery.build();
  const [reviews, meta] = await Promise.all([
    prisma.review.findMany({
      ...prismaQueryBuilt,
      include: {
        user: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prismaQuery.getMeta(prisma.review),
  ]);

  return {
    data: reviews,
    meta,
  };
};

const updateReview = async (reviewId: string, data: Partial<IReview>) => {
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data,
  });

  return updatedReview;
};
const deleteReview = async (reviewId: string, user: any) => {
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  const isOwner = existingReview?.userId === user.id;
  const isAdmin =
    user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  if (!isOwner && !isAdmin) {
    throw new Error("You do not have permission to delete this review");
  }

  if (!existingReview) {
    throw new Error("Review not found");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });
  const reviews = await prisma.review.findMany();
  return reviews;
};

export const ReviewService = {
  createReview,
  getReviewsByProductId,
  getALlReviews,
  updateReview,
  deleteReview,
};
