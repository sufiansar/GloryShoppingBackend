import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import dbConfig from "../../config/db.config";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const accessTokenExpireIn = dbConfig.jwt.accessToken_expiresIn as string;
  const refreshTokenExpireIn = dbConfig.jwt.refreshToken_expiresIn as string;

  const getMaxAge = (expiresIn: string) => {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));
    switch (unit) {
      case "y":
        return value * 365 * 24 * 60 * 60 * 1000;
      case "M":
        return value * 30 * 24 * 60 * 60 * 1000;
      case "w":
        return value * 7 * 24 * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "m":
        return value * 60 * 1000;
      case "s":
        return value * 1000;
      default:
        return 1000 * 60 * 60;
    }
  };

  const accessTokenMaxAge = getMaxAge(accessTokenExpireIn);
  const refreshTokenMaxAge = getMaxAge(refreshTokenExpireIn);

  const result = await AuthService.loginUser(req.body);
  const { accessToken, refreshToken, ...userData } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: accessTokenMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: refreshTokenMaxAge,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      ...userData,
      accessToken,
      refreshToken,
    },
  });
});

const logOUtUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

const changeUserPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id; // Assuming user ID is available in req.user
  const newPassword = req.body.newPassword;

  await AuthService.changeUserPassword(userId, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});

export const AuthController = {
  loginUser,
  logOUtUser,
  changeUserPassword,
};
