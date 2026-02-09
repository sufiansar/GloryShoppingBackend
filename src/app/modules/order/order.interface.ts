import { OrderStatus } from "@prisma/client";

export interface IOrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
  price: number;
}
export interface IOrder {
  id?: string;
  userId: string;
  status: OrderStatus;
  amount: number;
  orderDate: Date;
  items: IOrderItem[];
}

export interface DeliveryInput {
  name?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  deliveryCharge?: number;
}
type CheckoutType = "CART" | "DIRECT";

export interface CheckoutInput {
  type: CheckoutType;
  cartItemIds?: string[];
  variantId?: string;
  quantity?: number;
  delivery: DeliveryInput;
}
