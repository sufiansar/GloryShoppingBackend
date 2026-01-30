import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";

import httpStatus from "http-status";
import { ProductService } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const data = req.body.data ? JSON.parse(req.body.data) : { ...req.body };
  const thumbleImage = req.file?.path;
  const payload = { ...data, thumbleImage };
  const result = await ProductService.createProduct(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.getProductById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const query = req.query as Record<string, string>;
  const result = await ProductService.getProductBySlug(query, slug);
  console.log(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});
const getProductByBrand = catchAsync(async (req: Request, res: Response) => {
  const { brandId } = req.params;
  const query = req.query as Record<string, string>;
  const result = await ProductService.getProductByBrand(query, brandId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result,
  });
});
const getProductBySkinType = catchAsync(async (req: Request, res: Response) => {
  const { skinTypeId } = req.params;
  const query = req.query as Record<string, string>;
  const result = await ProductService.getProductBySkinType(query, skinTypeId);

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

const getProductBySkinConcern = catchAsync(
  async (req: Request, res: Response) => {
    const { skinConcernId } = req.params;
    const query = req.query as Record<string, string>;
    const result = await ProductService.getProductBySkinConcern(
      query,
      skinConcernId,
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
  const { categoryId } = req.params;
  const query = req.query as Record<string, string>;
  const result = await ProductService.getProductByCetegory(query, categoryId);

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
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const thumbleImage = req.file?.path;
  const data = req.body;
  const result = await ProductService.updateProduct(id, {
    ...data,
    thumbleImage,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.deleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});
export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getProductByBrand,
  getProductBySkinType,
  getProductByCetegory,
  getProductBySkinConcern,
};
