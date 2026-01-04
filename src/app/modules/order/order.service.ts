import { send } from "process";
import {
  DeliveryStatus,
  OrderStatus,
  UserRole,
} from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { sendEmail } from "../../utility/sendEmail";
import { ICartItem } from "../cart/cart.interface";
import { DeliveryInput } from "./order.interface";
import { v4 as uuidv4 } from "uuid";

const createOrder = async (
  userId: string | undefined,
  cartItems: ICartItem[],
  delivery: DeliveryInput
) => {
  const guestId = userId ? undefined : uuidv4();

  const order = await prisma.$transaction(async (tx) => {
    const productVariants = await tx.productVariant.findMany({
      where: { id: { in: cartItems.map((i) => i.variantId) } },
      include: { product: { select: { name: true } } },
    });

    const productTotal = cartItems.reduce((sum, item) => {
      const variant = productVariants.find((v) => v.id === item.variantId);
      if (!variant)
        throw new Error(`Product variant not found: ${item.variantId}`);
      return sum + item.quantity * variant.price!;
    }, 0);

    const deliveryCharge = delivery.deliveryCharge ?? 0;
    const finalAmount = productTotal + deliveryCharge;

    const orderData: any = {
      status: "PENDING",
      amount: finalAmount,
      items: {
        createMany: {
          data: cartItems.map((item) => {
            const variant = productVariants.find(
              (v) => v.id === item.variantId
            )!;
            return {
              quantity: item.quantity,
              price: variant.price!,
              productVariantId: variant.id,
              // product: variant.product.name,
            };
          }),
        },
      },
      delivery: {
        create: {
          name: delivery.name,
          phone: delivery.phone,
          email: delivery.email,
          address: delivery.address,
          city: delivery.city,
          postalCode: delivery.postalCode,
          deliveryCharge: deliveryCharge,
          status: "PROCESSING",
        },
      },
    };

    if (userId) {
      orderData.userId = userId;
    } else {
      orderData.guestId = guestId;
    }

    const order = await tx.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { name: true },
                },
              },
            },
          },
        },
        delivery: true,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        id: {
          in: cartItems
            .map((i) => i.id)
            .filter((id): id is string => id !== undefined),
        },
      },
    });

    return { ...order, productTotal, deliveryCharge };
  });

  await sendEmail({
    to: delivery.email,
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
        name: delivery.name ?? "Customer",
        email: delivery.email,
        phone: delivery.phone,
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

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return await prisma.$transaction(async (tx) => {
    let deliveryStatus: DeliveryStatus;
    switch (status) {
      case OrderStatus.PENDING:
        deliveryStatus = DeliveryStatus.PROCESSING;
        break;
      case OrderStatus.SHIPPED:
        deliveryStatus = DeliveryStatus.ON_THE_WAY;
        break;
      case OrderStatus.COMPLETED:
        deliveryStatus = DeliveryStatus.DELIVERED;
        break;
      case OrderStatus.CANCELLED:
        deliveryStatus = DeliveryStatus.CANCELED;
        break;
      default:
        deliveryStatus = DeliveryStatus.PROCESSING;
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        delivery: {
          update: { status: deliveryStatus },
        },
      },
      include: { delivery: true },
    });

    const email = updatedOrder.delivery?.email;
    if (email) {
      await sendEmail({
        to: email,
        subject: "Your Order Status Updated",
        templateName: "order-status-updated",
        templateData: {
          order: updatedOrder,
          customer: {
            name: updatedOrder.delivery?.name ?? "Customer",
            email,
            phone: updatedOrder.delivery?.phone ?? "N/A",
          },
          newStatus: status,
        },
      });
    }

    return updatedOrder;
  });
};

const getOrderBYId = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      delivery: true,
    },
  });
  return order;
};
const getALlOrders = async (query: Record<string, string>, userId?: string) => {
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

  const queryBuilder = new PrismaQueryBuilder(query).filter().sort().paginate();

  const prismaQuery = queryBuilder.build();

  const [orders, meta] = await Promise.all([
    prisma.order.findMany({
      ...prismaQuery,
      include: {
        items: true,
        delivery: true,
      },
    }),
    queryBuilder.getMeta(prisma.order),
  ]);

  return {
    data: orders,
    meta,
  };
};

const orderCancle = async (orderId: string) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        delivery: {
          update: { status: DeliveryStatus.CANCELED },
        },
      },
      include: { delivery: true },
    });
    console.log("Delivery email:", order.delivery?.email);
    await sendEmail({
      to: order.delivery?.email!,
      subject: "Your Order has been Cancelled",
      templateName: "order-cancelled",
      templateData: {
        order,
        customer: {
          name: order.delivery?.name ?? "Customer",
          email: order.delivery?.email ?? "Email",
          phone: order.delivery?.phone!,
        },
      },
    });

    return order;
  });
};

const orderDelete = async (orderId: string) => {
  const order = await prisma.order.delete({
    where: { id: orderId },
  });
  return order;
};
export const OrderService = {
  createOrder,
  updateOrderStatus,
  getOrderBYId,
  orderDelete,
  orderCancle,
  getALlOrders,
};
