// import dotenv from "dotenv";

// dotenv.config();

// import http, { Server } from "http";
// import app from "./app";
// import { seedSuperAdmin } from "./app/utility/seedSuperAdmin";

// let server: Server | null = null;

// async function startServer() {
//   try {
//     server = http.createServer(app);
//     server.listen(process.env.PORT, () => {
//       console.log(
//         `Database connected successfully.${process.env.DATABASE_URL}`,
//       );
//       console.log(`🚀 Server is running on port ${process.env.PORT}`);
//     });

//     handleProcessEvents();
//   } catch (error) {
//     console.error("❌ Error during server startup:", error);
//     process.exit(1);
//   }
// }

// /**
//  * Gracefully shutdown the server and close database connections.
//  * @param {string} signal - The termination signal received.
//  */
// async function gracefulShutdown(signal: string) {
//   console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

//   if (server) {
//     server.close(async () => {
//       console.log("✅ HTTP server closed.");

//       try {
//         console.log("Server shutdown complete.");
//       } catch (error) {
//         console.error("❌ Error during shutdown:", error);
//       }

//       process.exit(0);
//     });
//   } else {
//     process.exit(0);
//   }
// }

// /**
//  * Handle system signals and unexpected errors.
//  */
// function handleProcessEvents() {
//   process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
//   process.on("SIGINT", () => gracefulShutdown("SIGINT"));

//   process.on("uncaughtException", (error) => {
//     console.error("💥 Uncaught Exception:", error);
//     gracefulShutdown("uncaughtException");
//   });

//   process.on("unhandledRejection", (reason) => {
//     console.error("💥 Unhandled Rejection:", reason);
//     gracefulShutdown("unhandledRejection");
//   });
// }

// (async () => {
//   await seedSuperAdmin();
//   await startServer();
// })();
import { Server } from "http";
import app from "./app";
import { prisma } from "./app/config/prisma";
import { seedSuperAdmin } from "./app/utility/seedSuperAdmin";
import dbConfig from "./app/config/db.config";

async function serverStart() {
  let server: Server;

  try {
    // Test database connection FIRST
    console.log("🔌 Connecting to database...");
    await prisma.$connect();
    console.log("✅ Database connected successfully\n");

    // Seed super admin AFTER database connection is confirmed
    await seedSuperAdmin();

    // Start the server AFTER seeding
    server = app.listen(dbConfig.port, () => {
      console.log(
        `\n🚀 GloryShoppingBackend is running on http://localhost:${dbConfig.port}`,
      );
      console.log(`🌱 Environment: ${dbConfig.node_env}`);
      console.log(`💾 Database: Connected`);
    });

    const exitHandler = async (options?: { exit?: boolean }) => {
      console.log("\n🔄 Shutting down gracefully...");

      try {
        await prisma.$disconnect();
        console.log("💾 Database disconnected");
      } catch (error) {
        console.error("Error disconnecting database:", error);
      }

      if (server) {
        server.close(() => {
          console.log("✅ GloryShoppingBackend closed gracefully");
          if (options?.exit) process.exit(0);
        });
      } else if (options?.exit) {
        process.exit(0);
      }
    };

    process.on("unhandledRejection", (reason: any) => {
      console.error("\n❌ Unhandled Rejection detected, closing server...");
      console.error(reason);
      exitHandler({ exit: true });
    });

    process.on("uncaughtException", (error: any) => {
      console.error("\n❌ Uncaught Exception detected, closing server...");
      console.error(error);
      exitHandler({ exit: true });
    });

    process.on("SIGTERM", () => {
      console.log("\n⚠️  SIGTERM received, closing server...");
      exitHandler({ exit: true });
    });

    process.on("SIGINT", () => {
      console.log("\n⚠️  SIGINT received, closing server...");
      exitHandler({ exit: true });
    });
  } catch (error) {
    console.error("\n❌ Error during TravelBuddyServer startup:", error);

    if (error instanceof Error) {
      if (error.message.includes("ETIMEDOUT")) {
        console.error("\n📋 Database Connection Timeout:");
        console.error("  1. ✓ Check if your database server is running");
        console.error("  2. ✓ Verify DATABASE_URL in your .env file");
        console.error("  3. ✓ Check network/firewall settings");
        console.error("  4. ✓ Ensure database accepts connections");
        console.error(
          `\n  Current DATABASE_URL: ${dbConfig.database_url?.replace(
            /:[^:@]+@/,
            ":****@",
          )}`,
        );
      } else if (error.message.includes("ECONNREFUSED")) {
        console.error("\n📋 Database Connection Refused:");
        console.error("  1. ✓ Database server is not running");
        console.error("  2. ✓ Check the port number in DATABASE_URL");
        console.error("  3. ✓ Verify database service is active");
      }
    }

    // Ensure database is disconnected
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors during startup failure
    }

    process.exit(1);
  }
}

// Start the server
(async () => {
  await serverStart();
})();
