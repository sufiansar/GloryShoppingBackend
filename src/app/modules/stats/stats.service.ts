import { $Enums } from "@prisma/client";
import { prisma } from "../../config/prisma";

const calculateStats = (orders: any[]) => ({
  totalOrders: orders.length,
  totalRevenue: orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  ),
});

const getStats = async () => {
  const now = new Date();

  const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };

  const fetchOrders = (from: Date) =>
    prisma.order.findMany({
      where: {
        status: $Enums.OrderStatus.COMPLETED, // ✅ accuracy
        orderDate: {
          gte: from,
          lte: now,
        },
      },
      select: {},
    });

  const [orders7, orders15, orders30] = await Promise.all([
    fetchOrders(daysAgo(7)),
    fetchOrders(daysAgo(15)),
    fetchOrders(daysAgo(30)),
  ]);

  return {
    last7Days: calculateStats(orders7),
    last15Days: calculateStats(orders15),
    last30Days: calculateStats(orders30),
  };
};

const getBestProduct = async () => {
  const bestVariants = await prisma.orderItem.groupBy({
    by: ["productVariantId"],
    where: {
      order: {
        status: $Enums.OrderStatus.COMPLETED,
      },
    },
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

  const variants = await prisma.productVariant.findMany({
    where: {
      id: {
        in: bestVariants.map((v: any) => v.productVariantId),
      },
    },
    include: {
      product: {
        select: { id: true, name: true },
      },
    },
  });

  return bestVariants.map((item: any) => {
    const variant = variants.find((v: any) => v.id === item.productVariantId);

    return {
      productVariantId: item.productVariantId,
      productId: variant?.product.id,
      productName: variant?.product.name,
      totalSold: item._sum.quantity ?? 0,
    };
  });
};

const cancelledProducts = async () => {
  const cancelled = await prisma.orderItem.groupBy({
    by: ["productVariantId"],
    where: {
      order: {
        status: $Enums.OrderStatus.CANCELLED,
      },
    },
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

  return cancelled.map((item: any) => ({
    productVariantId: item.productVariantId,
    totalCancelled: item._sum.quantity ?? 0,
  }));
};

const getUserStats = async () => {
  const [totalUsers, adminUsers, superAdminUsers, customerUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: $Enums.UserRole.ADMIN } }),
      prisma.user.count({ where: { role: $Enums.UserRole.SUPER_ADMIN } }),
      prisma.user.count({ where: { role: $Enums.UserRole.USER } }),
    ]);

  return {
    totalUsers,
    adminUsers,
    superAdminUsers,
    customerUsers,
  };
};

const getCategoryStats = async () => {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          variants: {
            include: {
              orderItems: {
                where: {
                  order: {
                    status: $Enums.OrderStatus.COMPLETED,
                  },
                },
                select: { quantity: true },
              },
            },
          },
        },
      },
    },
  });

  return categories.map((category: any) => {
    const totalSold = category.products.reduce((sum: any, product: any) => {
      return (
        sum +
        product.variants.reduce((vSum: any, variant: any) => {
          return (
            vSum +
            variant.orderItems.reduce(
              (iSum: any, item: any) => iSum + item.quantity,
              0,
            )
          );
        }, 0)
      );
    }, 0);

    return {
      categoryId: category.id,
      categoryName: category.name,
      totalSold,
    };
  });
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
    products.forEach((product: any) => {
      product.variants.forEach((variant: any) => {
        variant.orderItems.forEach((item: any) => {
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
