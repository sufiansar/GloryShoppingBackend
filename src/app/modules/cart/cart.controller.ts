import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { CartService } from "./cart.service";
import { sendResponse } from "../../utility/sendResponse";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { variantId, quantity } = req.body;
  const result = await CartService.addToCart(userId, variantId, quantity);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item added to cart successfully",
    data: result,
  });
});

const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { variantId, quantity } = req.body;
  const result = await CartService.updateCartItem(userId, variantId, quantity);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart item updated successfully",
    data: result,
  });
});

const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { variantId } = req.params;
  const result = await CartService.removeCartItem(userId, variantId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart item removed successfully",
    data: result,
  });
});
export const CartController = {
  addToCart,
  updateCartItem,
  removeCartItem,
};
