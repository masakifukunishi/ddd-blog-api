import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

export async function setupTestDatabase() {
  execSync("npm run prisma:migrate-dev", {
    env: {
      ...process.env,
      DATABASE_URL: process.env.TEST_DATABASE_URL,
    },
  });

  const prisma = new PrismaClient();
  return prisma;
}
