import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Used for runtime queries (pooled, production-safe)
    url: env("DATABASE_URL"),
    // url: env("DIRECT_URL"),

    // shadowDatabaseUrl can be used for shadow database if needed
    // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
