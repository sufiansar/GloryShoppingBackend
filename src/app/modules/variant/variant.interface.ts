export interface CreateProductVariant {
  productId: string;
  sku: string;
  size: string;
  images: string[];
  price?: number;
  stock?: number;
  lowStockThreshold?: number;
}
