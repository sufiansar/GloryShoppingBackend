export interface IProduct {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  shortDesc?: string;
  longDesc?: string;
  faquestions?: string;
  thumbleImage?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  brandId: string;
  categoryId: string;
}
