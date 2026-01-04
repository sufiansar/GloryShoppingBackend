import { $Enums } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";

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
