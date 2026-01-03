import { OrderStatus } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import { ICartItem } from "../cart/cart.interface";

const createOrder = async (userId: string, cartItems: ICartItem[]) => {
  return await prisma.$transaction(async (tx) => {
    const productVariants = await tx.productVariant.findMany({
      where: {
        id: { in: cartItems.map((item) => item.variantId) },
      },
    });

    const amount = cartItems.reduce((sum, item) => {
      const variant = productVariants.find((v) => v.id === item.variantId);
      if (!variant)
        throw new Error(`Product variant not found: ${item.variantId}`);
      return sum + item.quantity * variant.price!;
    }, 0);

    const order = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        amount,
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
              };
            }),
          },
        },
      },
      include: {
        items: true,
      },
    });

    const cartItemIds = cartItems
      .map((item) => item.id)
      .filter((id) => id !== undefined);
    await tx.cartItem.deleteMany({
      where: { id: { in: cartItemIds } },
    });

    return order;
  });
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return updatedOrder;
};

const orderDelete = async (orderId: string) => {
  const deletedOrder = await prisma.order.delete({
    where: { id: orderId },
  });
  return deletedOrder;
};

export const OrderService = {
  createOrder,
  updateOrderStatus,
};
