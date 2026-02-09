import { CART_EVENT, CART_STATUS } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const addToCart = async (
  userId: string | null,
  productId: string,
  quantity: number = 1,
  sessionId: string | null,
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.variants || product.variants.length === 0) {
    throw new Error("No available variants for this product");
  }

  const variant = product.variants[0];
  const variantId = variant.id;

  return prisma.$transaction(async (tx: any) => {
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
  userId: string | null,
  productId: string,
  quantity: number,
  sessionId: string | null,
) => {
  if (!userId && !sessionId) {
    throw new Error("UserId or sessionId is required");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!product || !product.variants.length) {
    throw new Error("Product or variant not found");
  }

  const variantId = product.variants[0].id;

  return prisma.$transaction(async (tx: any) => {
    const cart = await tx.cart.findFirst({
      where: {
        status: CART_STATUS.ACTIVE,
        OR: [
          userId ? { userId } : undefined,
          sessionId ? { sessionId } : undefined,
        ].filter(Boolean) as any,
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

    // Remove item
    if (quantity <= 0) {
      await tx.cartItem.delete({
        where: { id: cartItem.id },
      });

      await tx.cartEvent.create({
        data: {
          cartId: cart.id,
          userId: userId ?? null,
          sessionId,
          eventType: CART_EVENT.PENDING,
        },
      });

      return { message: "Item removed from cart" };
    }

    // Update quantity
    const updatedItem = await tx.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    await tx.cartEvent.create({
      data: {
        cartId: cart.id,
        userId: userId ?? null,
        sessionId,
        eventType: CART_EVENT.ADD,
      },
    });

    return updatedItem;
  });
};

const removeCartItem = async (
  userId: string | null,
  productId: string,
  sessionId: string | null,
) => {
  if (!userId && !sessionId) {
    throw new Error("UserId or sessionId is required");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!product || !product.variants.length) {
    throw new Error("Product or variant not found");
  }

  const variantId = product.variants[0].id;

  const cart = await prisma.cart.findFirst({
    where: {
      status: CART_STATUS.ACTIVE,
      OR: [
        userId ? { userId } : undefined,
        sessionId ? { sessionId } : undefined,
      ].filter(Boolean) as any,
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

  await prisma.$transaction(async (tx: any) => {
    await tx.cartItem.delete({
      where: { id: cartItem.id },
    });

    await tx.cartEvent.create({
      data: {
        cartId: cart.id,
        userId: userId ?? null,
        sessionId,
        eventType: CART_EVENT.PENDING,
      },
    });
  });

  return { message: "Item removed from cart" };
};

const getCart = async (userId: string | null, sessionId: string | null) => {
  const whereClause = userId
    ? { userId, status: CART_STATUS.ACTIVE }
    : { sessionId, status: CART_STATUS.ACTIVE };

  const cart = await prisma.cart.findFirst({
    where: whereClause,
    include: {
      cartItems: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return { items: [], totalItems: 0, subtotal: 0 };
  }

  const items = cart.cartItems.map((item: any) => ({
    id: item.id,
    productId: item.variant.product.id,
    productName: item.variant.product.name,
    productImage:
      item.variant.product.thumbleImage ||
      item.variant.product.images?.[0] ||
      "",
    price: item.variant.product.price,
    originalPrice:
      item.variant.product.price && item.variant.product.discount
        ? item.variant.product.price * (1 + item.variant.product.discount / 100)
        : item.variant.product.price,
    quantity: item.quantity,
    variantId: item.variantId,
    variant: item.variant,
  }));

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0,
  );

  return {
    items,
    totalItems,
    subtotal,
    cartId: cart.id,
  };
};

const getCartCount = async (
  userId: string | null,
  sessionId: string | null,
) => {
  const whereClause = userId
    ? { userId, status: CART_STATUS.ACTIVE }
    : { sessionId, status: CART_STATUS.ACTIVE };

  const cart = await prisma.cart.findFirst({
    where: whereClause,
    include: {
      cartItems: true,
    },
  });

  if (!cart) {
    return { count: 0 };
  }

  const count = cart.cartItems.reduce(
    (sum: any, item: any) => sum + item.quantity,
    0,
  );
  return { count };
};
export const CartService = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
  getCartCount,
};
