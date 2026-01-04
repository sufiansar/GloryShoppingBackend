import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import { StatsService } from "./stats.service";

import httpStatus from "http-status";

const getStats = catchAsync(async (req, res) => {
  const stats = await StatsService.getStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stats fetched successfully",
    data: stats,
  });
});

const getBestProduct = catchAsync(async (req, res) => {
  const bestProducts = await StatsService.getBestProduct();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best products fetched successfully",
    data: bestProducts,
  });
});

const cancelledProducts = catchAsync(async (req, res) => {
  const cancelledProducts = await StatsService.cancelledProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cancelled products fetched successfully",
    data: cancelledProducts,
  });
});

const getUserStats = catchAsync(async (req, res) => {
  const userStats = await StatsService.getUserStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User stats fetched successfully",
    data: userStats,
  });
});

const getCategoryStats = catchAsync(async (req, res) => {
  const categoryStats = await StatsService.getCategoryStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category stats fetched successfully",
    data: categoryStats,
  });
});

const perCategoryStats = catchAsync(async (req, res) => {
  const categoryStats = await StatsService.perCategoryStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Per category stats fetched successfully",
    data: categoryStats,
  });
});

export const StatsController = {
  getStats,
  getBestProduct,
  cancelledProducts,
  getUserStats,
  getCategoryStats,
  perCategoryStats,
};
