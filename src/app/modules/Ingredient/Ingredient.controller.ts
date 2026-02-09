import { catchAsync } from "../../utility/catchAsync";
import { IngredientService } from "./Ingredient.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";
import { Request, Response } from "express";
import { IngredientFilterableFields } from "./ingrediant.constant";
import pick from "../../utility/pick";

const createIngredient = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await IngredientService.createIngredient(data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ingredient created successfully",
    data: result,
  });
});

const getAllIngredients = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, IngredientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await IngredientService.getAllIngredients(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ingredients retrieved successfully",
    data: {
      data: result.data,
      meta: result.meta,
    },
  });
});

const getIngredientById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await IngredientService.getIngredientById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ingredient retrieved successfully",
    data: result,
  });
});

const updateIngredient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await IngredientService.updateIngredient(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ingredient updated successfully",
    data: result,
  });
});

const deleteIngredient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await IngredientService.deleteIngredient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ingredient deleted successfully",
    data: result,
  });
});

const joinIngredientsToProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { productId, ingredientIds } = req.body;
    const result = await IngredientService.joinIngredientsToProduct(
      ingredientIds,
      productId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ingredients joined to product successfully",
      data: result,
    });
  },
);

export const IngredientController = {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  joinIngredientsToProduct,
};
