import express from "express";
import { PrismaClient } from "@prisma/client";
import { UserController } from "./interface/controllers/UserController";
import { ArticleController } from "./interface/controllers/ArticleController";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaArticleRepository } from "./infrastructure/repositories/PrismaArticleRepository";
import { UserApplicationService } from "./application/services/UserApplicationService";
import { ArticleApplicationService } from "./application/services/ArticleApplicationService";

async function bootstrap() {
  // Initialize Express application
  const app = express();
  app.use(express.json());

  // Initialize Prisma client
  const prisma = new PrismaClient();
  await prisma.$connect();

  // Initialize repositories
  const userRepository = new PrismaUserRepository(prisma);
  const articleRepository = new PrismaArticleRepository(prisma);

  // Initialize application services
  const userApplicationService = new UserApplicationService(userRepository);
  const articleApplicationService = new ArticleApplicationService(articleRepository, userRepository);

  // Initialize controllers
  const userController = new UserController(userApplicationService);
  const articleController = new ArticleController(articleApplicationService);

  // Setup routes
  // User routes
  app.post("/users", userController.create.bind(userController));

  // Article routes
  app.post("/articles", articleController.create.bind(articleController));
  app.delete("/articles/:id", articleController.delete.bind(articleController));

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Graceful shutdown handler
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    await prisma.$disconnect();
    process.exit(0);
  });
}

// Bootstrap application
bootstrap().catch((err) => {
  console.error("Failed to start application:", err);
  process.exit(1);
});
