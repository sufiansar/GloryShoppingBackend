import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { SectionService } from "./section.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";

const createSection = catchAsync(async (req: Request, res: Response) => {
  const data = req.body || JSON.parse(req.body.data);
  const images = (req.files as Express.Multer.File[]).map((file) => file.path);

  const payload = {
    ...data,
    images,
  };
  const result = await SectionService.createSection(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Section created successfully",
    data: result,
  });
});

const getAllSections = catchAsync(async (req: Request, res: Response) => {
  const result = await SectionService.getAllSections(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sections retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSectionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SectionService.getSectionById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Section retrieved successfully",
    data: result,
  });
});

const updateSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const images = (req.files as Express.Multer.File[]).map((file) => file.path);
  const data = req.body;
  const payload = {
    ...data,
    images,
  };
  const result = await SectionService.updateSection(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Section updated successfully",
    data: result,
  });
});

const deleteSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SectionService.deleteSection(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Section deleted successfully",
    data: result,
  });
});

export const SectionController = {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
};
