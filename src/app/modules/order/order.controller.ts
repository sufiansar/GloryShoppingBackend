import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { OrderService } from "./order.service";
import AppError from "../../errorHelpers/AppError";
import pick from "../../utility/pick";
import { OrderFilterableFields } from "./order.constant";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { type, cartItemIds, variantId, quantity, delivery } = req.body;

  if (!type || !["CART", "DIRECT"].includes(type)) {
    throw new AppError(400, "Checkout type is required");
  }

  if (!delivery?.email || !delivery?.phone || !delivery?.address) {
    throw new AppError(400, "Delivery information is incomplete");
  }

  // CART checkout validation
  if (type === "CART") {
    if (!cartItemIds || !Array.isArray(cartItemIds) || !cartItemIds.length) {
      throw new AppError(400, "Cart items are required");
    }
  }

  // DIRECT checkout validation
  if (type === "DIRECT") {
    if (!variantId || !quantity) {
      throw new AppError(400, "VariantId and quantity are required");
    }
  }

  const result = await OrderService.createOrder(userId, {
    type,
    cartItemIds,
    variantId,
    quantity,
    delivery,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message:
      type === "CART"
        ? "Order placed from cart successfully"
        : "Order placed successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const adminId = req.user?.id;

  if (!status) {
    throw new AppError(400, "Order status is required");
  }

  const result = await OrderService.updateOrderStatus(
    orderId,
    status,
    adminId!,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

const getALlOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, OrderFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const userId = req.user?.id;
  const result = await OrderService.getALlOrders(filters, options, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});
const getOrderBYId = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const userId = req.user?.id;
  const guestId = req.headers["x-guest-id"] as string | undefined;

  const result = await OrderService.getOrderBYId(orderId, userId, guestId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

const orderCancle = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const result = await OrderService.orderCancle(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order cancelled successfully",
    data: result,
  });
});
const orderDelete = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const orderId = req.params.id;
  const result = await OrderService.orderDelete(orderId, userId!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  updateOrderStatus,
  getOrderBYId,
  orderDelete,
  orderCancle,
  getALlOrders,
};
