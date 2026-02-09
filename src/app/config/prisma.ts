import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

// import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../../generated/prisma";

// const connectionString = `${process.env.DATABASE_URL}`;

// // Create the PrismaPg adapter
// const adapter = new PrismaPg({ connectionString });

// // Reuse PrismaClient across serverless invocations (Vercel)
// declare global {
//   var prisma: PrismaClient | undefined;
// }

// export const prisma = global.prisma || new PrismaClient({ adapter });

// // In development, reuse global prisma to avoid too many connections
// if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // Optional: enable query logging for debugging
// // prisma.$on('query', (e) => {
// //   console.log('Query: ' + e.query);
// });
