import { OrderStatus } from "../../../generated/prisma";

export interface IOrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
  price: number;
}
export interface IOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  amount: number;
  orderDate: Date;
  items: IOrderItem[];
}
