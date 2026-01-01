import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const reviewData = req.body;
  const result = await ReviewService.createReview(reviewData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getReviewsByProductId = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await ReviewService.getReviewsByProductId(productId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  }
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getALlReviews(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ReviewService.updateReview(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.deleteReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviewsByProductId,
  getAllReviews,
  updateReview,
  deleteReview,
};
