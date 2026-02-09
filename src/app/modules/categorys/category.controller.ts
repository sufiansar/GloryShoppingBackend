import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";
import pick from "../../utility/pick";
import { CategoryFilterableFields } from "./category.filterableField";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryData = req.body;
  const result = await CategoryService.createCategory(categoryData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CategoryFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await CategoryService.getAllCategories(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: {
      data: result.data,
      meta: result.meta,
    },
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CategoryService.getSingleCategory(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const getAllProductByCategoryBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const filters = pick(req.query, CategoryFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await CategoryService.getAllProductByCategoryBySlug(
      filters,
      options,
      slug,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Products retrieved successfully",
      data: {
        data: result.data,
        meta: result.meta,
      },
    });
  },
);

const getProductByCetegory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const filters = pick(req.query, CategoryFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await CategoryService.getProductByCetegory(
    filters,
    options,
    categoryId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    data: {
      data: result.data,
      meta: result.meta,
    },
  });
});

const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await CategoryService.getCategoryBySlug(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const categoryData = req.body;
  const result = await CategoryService.updateCategory(id, categoryData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CategoryService.deleteCategory(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  getProductByCetegory,
  getAllProductByCategoryBySlug,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
