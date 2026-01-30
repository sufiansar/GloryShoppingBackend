import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { CartService } from "./cart.service";
import { sendResponse } from "../../utility/sendResponse";
import { v4 as uuidv4 } from "uuid";

// cart.controller.ts
import cookieParser from "cookie-parser"; // make sure app.use(cookieParser())

const resolveIds = (req: Request) => ({
  userId: req.user?.id || null,
  sessionId:
    (req.headers["x-session-id"] as string) ||
    req.cookies?.sessionId ||
    req.body?.sessionId ||
    null,
});

// export const addToCart = catchAsync(async (req: Request, res: Response) => {
//   const userId = req?.user?.id || null;

//   let sessionId = req.cookies?.sessionId || req.body.sessionId || null;

//   if (!userId && !sessionId) {
//     sessionId = uuidv4();
//     res.cookie("sessionId", sessionId, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });
//   }

//   const { productId, quantity } = req.body;
//   const quantityNumber = Number(quantity);

//   const result = await CartService.addToCart(
//     userId,
//     productId,
//     quantityNumber,
//     sessionId,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Item added to cart successfully",
//     data: result,
//   });
// });

const addToCart = catchAsync(async (req, res) => {
  let { userId, sessionId } = resolveIds(req);
  if (!userId && !sessionId) {
    sessionId = uuidv4();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
  const { productId, quantity } = req.body;
  const result = await CartService.addToCart(
    userId,
    productId,
    Number(quantity),
    sessionId,
  );
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item added to cart successfully",
    data: result,
  });
});

const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const { userId, sessionId } = resolveIds(req);
  const { productId, quantity } = req.body;
  const result = await CartService.updateCartItem(
    userId,
    productId,
    quantity,
    sessionId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart item updated successfully",
    data: result,
  });
});

const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const { userId, sessionId } = resolveIds(req);
  const { productId } = req.params;
  const result = await CartService.removeCartItem(userId, productId, sessionId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart item removed successfully",
    data: result,
  });
});

// const getCart = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.id || null;

//   // Read sessionId from header, cookie, or body
//   let sessionId =
//     (req.headers["x-session-id"] as string) ||
//     req.cookies?.sessionId ||
//     req.body?.sessionId ||
//     null;

//   // If still missing, create one for guests
//   if (!userId && !sessionId) {
//     sessionId = uuidv4();
//     res.cookie("sessionId", sessionId, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });
//   }

//   // If still missing, bail
//   if (!userId && !sessionId) {
//     res.status(400).json({
//       success: false,
//       message: "userId or sessionId is required",
//     });
//     return;
//   }

//   const cart = await CartService.getCart(userId, sessionId);
//   return sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Cart fetched successfully",
//     data: cart,
//   });
// });

const getCart = catchAsync(async (req: Request, res: Response) => {
  let { userId, sessionId } = resolveIds(req);
  if (!userId && !sessionId) {
    sessionId = uuidv4();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
  if (!userId && !sessionId) {
    res
      .status(400)
      .json({ success: false, message: "userId or sessionId is required" });
    return;
  }
  const cart = await CartService.getCart(userId, sessionId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });
});
const getCartCount = catchAsync(async (req, res) => {
  let { userId, sessionId } = resolveIds(req);
  if (!userId && !sessionId) {
    sessionId = uuidv4();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
  if (!userId && !sessionId) {
    res
      .status(400)
      .json({ success: false, message: "userId or sessionId is required" });
    return;
  }
  const cart = await CartService.getCart(userId, sessionId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart count fetched successfully",
    data: cart,
  });
});

// const getCartCount = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.id || null;

//   let sessionId = req.cookies?.sessionId || req.body.sessionId || null;

//   if (!userId && !sessionId) {
//     sessionId = uuidv4();
//     res.cookie("sessionId", sessionId, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });
//   }
//   if (!userId && !sessionId) {
//     res.status(400).json({
//       success: false,
//       message: "userId or sessionId is required",
//     });
//     return;
//   }

//   const cart = await CartService.getCart(userId, sessionId);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Cart count fetched successfully",
//     data: cart,
//   });
// });
export const CartController = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
  getCartCount,
};

// Do the same resolveIds logic for updateCartItem and removeCartItem
