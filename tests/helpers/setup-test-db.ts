import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

export async function setupTestDatabase() {
  process.env.DATABASE_URL = "file:./test.db";
  execSync("npx prisma migrate deploy", {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });

  const prisma = new PrismaClient();
  return prisma;
}
