import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { VariantService } from "./varirant.service";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
const createdVariant = catchAsync(async (req: Request, res: Response) => {
  const data = req.body || JSON.parse(req.body.data);
  const images = (req.files as Express.Multer.File[]).map((file) => file.path);

  const payload = {
    ...data,
    images,
  };
  const result = await VariantService.createProductVariant(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product variant created successfully",
    data: result,
  });
});

const getAllVariants = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.getAllVariants(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product variants retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getVariantBySku = catchAsync(async (req: Request, res: Response) => {
  const { sku } = req.params;
  const result = await VariantService.getVariantBySku(sku);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product variant retrieved successfully",
    data: result,
  });
});

const updateVariant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const images = req.files
    ? (req.files as Express.Multer.File[]).map((file) => file.path)
    : undefined;
  const data = req.body;
  const result = await VariantService.updateVariant(id, {
    ...data,
    images,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product variant updated successfully",
    data: result,
  });
});

const deleteVariant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VariantService.deleteVariant(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product variant deleted successfully",
    data: result,
  });
});

export const VariantController = {
  createdVariant,
  getAllVariants,
  getVariantBySku,
  updateVariant,
  deleteVariant,
};
