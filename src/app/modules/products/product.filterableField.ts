export const productFilters = {
  isActive: (value: string) => ({
    isActive: value === "true",
  }),

  isNew: (value: string) => ({
    isNew: value === "true",
  }),

  isFeatured: (value: string) => ({
    isFeatured: value === "true",
  }),

  isTrending: (value: string) => ({
    isTrending: value === "true",
  }),

  isBestSeller: (value: string) => ({
    isBestSeller: value === "true",
  }),

  brandId: (value: string) => ({
    brandId: value,
  }),

  categoryId: (value: string) => ({
    categoryId: value,
  }),

  minPrice: (value: string) => ({
    price: {
      gte: Number(value),
    },
  }),

  maxPrice: (value: string) => ({
    price: {
      lte: Number(value),
    },
  }),
};
