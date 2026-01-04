import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { OrderService } from "./order.service";
import AppError from "../../errorHelpers/AppError";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || undefined;
  const { cartItems, delivery } = req.body;

  if (!cartItems || !cartItems.length) {
    throw new AppError(400, "Cart items are required");
  }

  if (!delivery?.email || !delivery?.phone || !delivery?.address) {
    throw new AppError(400, "Delivery information is incomplete");
  }

  const result = await OrderService.createOrder(userId, cartItems, delivery);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const status = req.body.status;
  const result = await OrderService.updateOrderStatus(orderId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

const getALlOrders = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const userId = req.user?.id;
  const result = await OrderService.getALlOrders(query, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});
const getOrderBYId = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const result = await OrderService.getOrderBYId(orderId);

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
  const orderId = req.params.id;
  const result = await OrderService.orderDelete(orderId);

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
