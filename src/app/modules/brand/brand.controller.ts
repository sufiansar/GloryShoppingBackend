import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { Multer } from "multer";
import { sendResponse } from "../../utility/sendResponse";
import { BrandService } from "./brand.service";
import httpStatus from "http-status";
import { CategoryFilterableFields } from "../categorys/category.filterableField";
import { BrandFilterableFields } from "./brand.constant";
import pick from "../../utility/pick";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const data = req.body.data ? JSON.parse(req.body.data) : { ...req.body };

  const payload = {
    ...data,
    logoUrl: req.file?.path,
  };

  console.log("payload:", payload);

  const result = await BrandService.createBrand(payload);

  console.log("result:", result);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Brand created successfully",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BrandFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await BrandService.getAllBrands(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brands retrieved successfully",
    data: {
      data: result.data,
      meta: result.meta,
    },
  });
});

const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.getBrandById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand retrieved successfully",
    data: result,
  });
});

const getBrandBySlugWithProducts = catchAsync(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const filters = pick(req.query, BrandFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await BrandService.getBrandBySlugWithProducts(
      filters,
      options,
      slug,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand with products retrieved successfully",
      data: {
        data: result.data,
        meta: result.meta,
      },
    });
  },
);
const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const logoUrl = req.file?.path;
  const data = req.body;
  const result = await BrandService.updateBrand(id, { ...data, logoUrl });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.deleteBrand(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand deleted successfully",
    data: result,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  getBrandBySlugWithProducts,
  getBrandById,
  updateBrand,
  deleteBrand,
};
