import { CART_EVENT, CART_STATUS } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";

export const addToCart = async (
  userId: string | null,
  variantId: string,
  quantity: number = 1,
  sessionId: string | null
) => {
  return prisma.$transaction(async (tx) => {
    let cart;
    if (userId) {
      cart = await tx.cart.upsert({
        where: {
          userId_status: { userId, status: CART_STATUS.ACTIVE },
        },
        update: {},
        create: {
          userId,
          status: CART_STATUS.ACTIVE,
        },
      });
    } else {
      if (!sessionId) {
        throw new Error("sessionId is required for guest users");
      }
      cart = await tx.cart.upsert({
        where: { sessionId },
        update: {},
        create: {
          sessionId,
          status: CART_STATUS.ACTIVE,
        },
      });
    }

    const cartItem = await tx.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });

    const cartEvent = await tx.cartEvent.create({
      data: {
        cartId: cart.id,
        userId: userId || null,
        sessionId: userId ? null : sessionId,
        eventType: CART_EVENT.ADD,
      },
    });

    return {
      cart,
      cartItem,
      cartEvent,
      sessionId,
    };
  });
};

const updateCartItem = async (
  userId: string,
  variantId: string,
  quantity: number
) => {
  return await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: {
        userId,
        status: CART_STATUS.ACTIVE,
      },
    });

    if (!cart) {
      throw new Error("Active cart not found");
    }

    const cartItem = await tx.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    if (quantity <= 0) {
      await tx.cartItem.delete({
        where: { id: cartItem.id },
      });

      await tx.cartEvent.create({
        data: {
          cartId: cart.id,
          userId,
          eventType: CART_EVENT.PENDING,
        },
      });

      return { message: "Item removed from cart" };
    }

    const updatedItem = await tx.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    await tx.cartEvent.create({
      data: {
        cartId: cart.id,
        userId,
        eventType: CART_EVENT.ADD,
      },
    });

    return updatedItem;
  });
};

const removeCartItem = async (userId: string, variantId: string) => {
  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      status: CART_STATUS.ACTIVE,
    },
  });

  if (!cart) {
    throw new Error("Active cart not found");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      variantId,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.delete({
      where: { id: cartItem.id },
    });

    await tx.cartEvent.create({
      data: {
        cartId: cart.id,
        userId,
        eventType: CART_EVENT.PENDING,
      },
    });
  });

  return { message: "Item removed from cart" };
};

export const CartService = {
  addToCart,
  updateCartItem,
  removeCartItem,
};
