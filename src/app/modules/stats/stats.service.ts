import { $Enums } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";

const calculateStats = (orders: any[]) => {
  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
  };
};

const getStats = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const last15Days = new Date();
  last15Days.setDate(last15Days.getDate() - 15);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const orders7 = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: last7Days,
        lte: new Date(),
      },
    },
  });
  const orders30 = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: last30Days,
        lte: new Date(),
      },
    },
  });
  const orders15 = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: last15Days,
        lte: new Date(),
      },
    },
  });

  return {
    last7Days: calculateStats(orders7),
    last15Days: calculateStats(orders15),
    last30Days: calculateStats(orders30),
  };
};

const getBestProduct = async () => {
  const bestProducts = await prisma.orderItem.groupBy({
    by: ["productVariantId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const productDetails = await Promise.all(
    bestProducts.map(async (item) => {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
        include: { product: true },
      });
      return {
        productVariantId: item.productVariantId,
        totalSold: item._sum.quantity,
        productName: variant?.product.name,
      };
    })
  );

  return productDetails;
};

const cancelledProducts = async () => {
  const cancelledOrders = await prisma.order.findMany({
    where: { status: $Enums.OrderStatus.CANCELLED },
    include: { items: true },
  });

  const productCancellationCount: { [key: string]: number } = {};

  cancelledOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productCancellationCount[item.productVariantId]) {
        productCancellationCount[item.productVariantId] = 0;
      }
      productCancellationCount[item.productVariantId] += item.quantity;
    });
  });

  const sortedCancellations = Object.entries(productCancellationCount)
    .sort((a, b) => b[1] - a[1])
    .map(([productVariantId, totalCancelled]) => ({
      productVariantId,
      totalCancelled,
    }))
    .slice(0, 5);

  return sortedCancellations;
};

const getUserStats = async () => {
  const totalUsers = await prisma.user.count();
  const adminUsers = await prisma.user.count({
    where: {
      role: $Enums.UserRole.ADMIN,
    },
  });
  const superAdminUsers = await prisma.user.count({
    where: {
      role: $Enums.UserRole.SUPER_ADMIN,
    },
  });
  const customerUsers = await prisma.user.count({
    where: {
      role: $Enums.UserRole.USER,
    },
  });

  return {
    totalUsers,
    adminUsers,
    superAdminUsers,
    customerUsers,
  };
};

const getCategoryStats = async () => {
  const categoryStats = await prisma.category.findMany({
    include: {
      products: {
        include: {
          variants: {
            include: {
              orderItems: true,
            },
          },
        },
      },
    },
  });

  const stats = categoryStats.map((category) => {
    let totalSold = 0;
    category.products.forEach((product) => {
      product.variants.forEach((variant) => {
        variant.orderItems.forEach((item) => {
          totalSold += item.quantity;
        });
      });
    });
    return {
      categoryId: category.id,
      categoryName: category.name,
      totalSold,
    };
  });

  return stats;
};

const perCategoryStats = async () => {
  const categories = await prisma.category.findMany();
  const stats = [];

  for (const category of categories) {
    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      include: {
        variants: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    let totalSold = 0;
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        variant.orderItems.forEach((item) => {
          totalSold += item.quantity;
        });
      });
    });

    stats.push({
      categoryId: category.id,
      categoryName: category.name,
      totalSold,
    });
  }

  return stats;
};
export const StatsService = {
  getStats,
  getBestProduct,
  cancelledProducts,
  getUserStats,
  getCategoryStats,
  perCategoryStats,
};
