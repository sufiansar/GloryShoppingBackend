import {
  Cart,
  CART_EVENT,
  CART_STATUS,
  ProductVariant,
  User,
} from "@prisma/client";

export interface ICart {
  userId?: string | undefined;
  sessionId?: string | null;
  status: CART_STATUS;
  cartItems?: ICartItem[];
  cartEvents?: ICartEvent[];
}
export interface ICartItem {
  id?: string;
  cartId: string;
  variantId: string;
  quantity: number;
  cart?: Cart;
  variant?: ProductVariant;
}

export interface ICartEvent {
  cartId: string;
  userId?: string | undefined;
  sessionId?: string | null;
  eventType: CART_EVENT;
  timestamp: Date;
  cart?: Cart;
  user?: User | null;
}
