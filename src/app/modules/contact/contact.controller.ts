import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { ContactService } from "./contact.service";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";

const submit = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.submitContact(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message sent successfully",
    data: result,
  });
});

export const ContactController = {
  submit,
};
