import { send } from "process";
import {
  DeliveryStatus,
  OrderStatus,
  Prisma,
  UserRole,
} from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { sendEmail } from "../../utility/sendEmail";
import { CheckoutInput, DeliveryInput } from "./order.interface";
import { v4 as uuidv4 } from "uuid";
import { paginationHelper } from "../../utility/paginationField";
import { OrderSearchAbleFields } from "./order.constant";

export const createOrder = async (
  userId: string | undefined,
  input: CheckoutInput,
) => {
  const guestId = !userId && input.type === "CART" ? uuidv4() : undefined;

  const order = await prisma.$transaction(async (tx) => {
    let items: {
      variantId: string;
      quantity: number;
      price: number;
      productName: string;
      cartItemId?: string;
    }[] = [];

    if (input.type === "CART") {
      if (!input.cartItemIds?.length) {
        throw new Error("Cart items are required");
      }

      const cartItems = await tx.cartItem.findMany({
        where: {
          id: { in: input.cartItemIds },
        },
        include: {
          variant: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      });

      if (!cartItems.length) {
        throw new Error("Cart items not found");
      }

      items = cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.variant.price!,
        productName: item.variant.product.name,
        cartItemId: item.id,
      }));
    }

    if (input.type === "DIRECT") {
      if (!input.variantId || !input.quantity) {
        throw new Error("VariantId and quantity are required");
      }

      const variant = await tx.productVariant.findUnique({
        where: { id: input.variantId },
        include: {
          product: { select: { name: true } },
        },
      });

      if (!variant || !variant.price) {
        throw new Error("Product variant not found");
      }

      items = [
        {
          variantId: variant.id,
          quantity: input.quantity,
          price: variant.price,
          productName: variant.product.name,
        },
      ];
    }

    const productTotal = items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0,
    );

    const deliveryCharge = input.delivery.deliveryCharge ?? 0;
    const finalAmount = productTotal + deliveryCharge;

    const orderData: any = {
      status: "PENDING",
      amount: finalAmount,

      items: {
        createMany: {
          data: items.map((i) => ({
            quantity: i.quantity,
            price: i.price,
            productVariantId: i.variantId,
            product: i.productName,
          })),
        },
      },

      delivery: {
        create: {
          ...input.delivery,
          deliveryCharge,
          status: "PROCESSING",
        },
      },
    };

    if (userId) {
      orderData.userId = userId;
    }

    if (!userId && guestId) {
      orderData.guestId = guestId;
    }

    const order = await tx.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true } },
              },
            },
          },
        },
        delivery: true,
      },
    });

    if (input.type === "CART") {
      await tx.cartItem.deleteMany({
        where: {
          id: {
            in: items.map((i) => i.cartItemId).filter(Boolean) as string[],
          },
        },
      });
    }

    return {
      ...order,
      productTotal,
      deliveryCharge,
    };
  });

  await sendEmail({
    to: input.delivery.email,
    subject: "Your Order is Confirmed",
    templateName: "order-confirmation",
    templateData: {
      order,
      pricing: {
        productTotal: order.productTotal,
        deliveryCharge: order.deliveryCharge,
        grandTotal: order.amount,
      },
      customer: {
        name: input.delivery.name ?? "Customer",
        email: input.delivery.email,
        phone: input.delivery.phone,
      },
      shipping: {
        address: order.delivery?.address,
        city: order.delivery?.city,
        postalCode: order.delivery?.postalCode,
        phone: order.delivery?.phone,
      },
      items: order.items.map((item) => ({
        name: item.variant?.product.name || "Product",
        quantity: item.quantity,
        price: item.price,
      })),
    },
  });

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  adminId: string,
) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { id: true, role: true },
  });

  if (
    !admin ||
    (admin.role !== UserRole.ADMIN && admin.role !== UserRole.SUPER_ADMIN)
  ) {
    throw new Error("Unauthorized");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { delivery: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const deliveryStatusMap: Record<OrderStatus, DeliveryStatus> = {
      PENDING: DeliveryStatus.PROCESSING,
      SHIPPED: DeliveryStatus.ON_THE_WAY,
      COMPLETED: DeliveryStatus.DELIVERED,
      CANCELLED: DeliveryStatus.CANCELED,
      PAID: DeliveryStatus.DELIVERED,
    };

    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(order.delivery && {
          delivery: {
            update: {
              status: deliveryStatusMap[status] ?? DeliveryStatus.PROCESSING,
            },
          },
        }),
      },
      include: {
        delivery: true,
        items: true,
      },
    });

    return updated;
  });

  if (updatedOrder.delivery?.email) {
    await sendEmail({
      to: updatedOrder.delivery.email,
      subject: "Your Order Status Updated",
      templateName: "order-status-updated",
      templateData: {
        order: updatedOrder,
        newStatus: status,
        customer: {
          name: updatedOrder.delivery.name ?? "Customer",
          email: updatedOrder.delivery.email,
          phone: updatedOrder.delivery.phone ?? "N/A",
        },
        shipping: {
          address: updatedOrder.delivery.address,
          city: updatedOrder.delivery.city,
          postalCode: updatedOrder.delivery.postalCode,
        },
      },
    });
  }

  return updatedOrder;
};

const getOrderBYId = async (
  orderId: string,
  userId?: string,
  guestId?: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      delivery: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.userId && userId && order.userId !== userId) {
    throw new Error("Unauthorized");
  }

  if (order.guestId && guestId && order.guestId !== guestId) {
    throw new Error("Unauthorized");
  }

  return order;
};

const getALlOrders = async (
  filters: Record<string, any>,
  options: Record<string, any>,
  userId?: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const isUserExists = await prisma.user.findUnique({
    where: { id: userId || "" },
  });

  if (userId && !isUserExists) {
    throw new Error("User not found");
  }

  if (
    isUserExists?.role !== UserRole.ADMIN &&
    isUserExists?.role !== UserRole.SUPER_ADMIN
  ) {
    throw new Error("Unauthorized access");
  }

  const andConditions: Prisma.OrderWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: OrderSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const orders = await prisma.order.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      items: true,
      delivery: true,
    },
  });

  const total = await prisma.order.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: orders,
  };
};

const orderCancle = async (
  orderId: string,
  userId?: string,
  guestId?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { delivery: true },
    });

    if (!order) throw new Error("Order not found");

    if (order.userId && userId && order.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (order.guestId && guestId && order.guestId !== guestId) {
      throw new Error("Unauthorized");
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        delivery: {
          update: { status: DeliveryStatus.CANCELED },
        },
      },
      include: { delivery: true },
    });

    await sendEmail({
      to: updatedOrder.delivery?.email!,
      subject: "Your Order has been Cancelled",
      templateName: "order-cancelled",
      templateData: {
        order: updatedOrder,
        customer: {
          name: updatedOrder.delivery?.name ?? "Customer",
          email: updatedOrder.delivery?.email!,
          phone: updatedOrder.delivery?.phone!,
        },
      },
    });

    return updatedOrder;
  });
};

const orderDelete = async (orderId: string, adminId: string) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (admin?.role !== UserRole.SUPER_ADMIN) {
    throw new Error("Only SUPER_ADMIN can delete orders");
  }

  return prisma.order.delete({
    where: { id: orderId },
  });
};

export const OrderService = {
  createOrder,
  updateOrderStatus,
  getOrderBYId,
  orderDelete,
  orderCancle,
  getALlOrders,
};
