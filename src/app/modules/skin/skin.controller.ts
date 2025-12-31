import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { SkinService } from "./skin.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";

const createSkinConcern = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await SkinService.createSkinConcern(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Skin concern created successfully",
    data: result,
  });
});

const getAllSkinConcerns = catchAsync(async (req: Request, res: Response) => {
  const result = await SkinService.getAllSkinConcerns(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin concerns retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});
const getSkinConcernById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SkinService.getSkinConcernById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin concern retrieved successfully",
    data: result,
  });
});

const updateSkinConcern = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await SkinService.updateSkinConcern(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin concern updated successfully",
    data: result,
  });
});
const deleteSkinConcern = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SkinService.deleteSkinConcern(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin concern deleted successfully",
    data: result,
  });
});

const createSkinType = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await SkinService.createSkinType(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Skin type created successfully",
    data: result,
  });
});
const getAllSkinTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await SkinService.getAllSkinTypes(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin types retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});
const getSkinTypeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SkinService.getSkinTypeById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin type retrieved successfully",
    data: result,
  });
});

const updateSkinType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await SkinService.updateSkinType(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin type updated successfully",
    data: result,
  });
});
const deleteSkinType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SkinService.deleteSkinType(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skin type deleted successfully",
    data: result,
  });
});

const addProductSkin = catchAsync(async (req: Request, res: Response) => {
  const { productId, skinConcernIds, skinTypeIds } = req.body;
  const result = await SkinService.addProductSkin(
    productId,
    skinConcernIds,
    skinTypeIds
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product skin concerns and types added successfully",
    data: {
      skinConcerns: result.productSkinConcern,
      skinTypes: result.productSkinType,
    },
  });
});
export const SkinController = {
  createSkinConcern,
  getAllSkinConcerns,
  getSkinConcernById,
  updateSkinConcern,
  deleteSkinConcern,
  createSkinType,
  getAllSkinTypes,
  getSkinTypeById,
  updateSkinType,
  deleteSkinType,
  addProductSkin,
};
