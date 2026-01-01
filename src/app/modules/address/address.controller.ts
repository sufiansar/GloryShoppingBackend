import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { AddressService } from "./adress.service";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";

const createAddress = catchAsync(async (req: Request, res: Response) => {
  const addressData = req.body;
  const result = await AddressService.createAddress(addressData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Address created successfully",
    data: result,
  });
});

const getAllAddresses = catchAsync(async (req: Request, res: Response) => {
  const result = await AddressService.getAllAddresses(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Addresses retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAddressById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AddressService.getAddressById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Address retrieved successfully",
    data: result,
  });
});

const updateAddress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AddressService.updateAddress(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Address updated successfully",
    data: result,
  });
});

const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AddressService.deleteAddress(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Address deleted successfully",
    data: result,
  });
});

export const AddressController = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
