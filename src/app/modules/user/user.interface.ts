import { UserRole } from "../../../generated/prisma";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role: UserRole;
  profileImage?: string | null;
  isVerified: boolean;
  isActive: boolean;
  addresses: IAddress[];
  //   orders: IOrder[];
  reviews: IReview[];
}

export interface IAddress {
  userId: string;
  label?: string | null;
  name: string;
  street: string;
  city: string;
  district: string;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
  user?: IUser;
}

export interface IReview {
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;

  //   product?: IProduct;
  user?: IUser;

  createdAt: Date;
}
