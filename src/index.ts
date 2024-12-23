import express from "express";
import { json } from "express";
import { PrismaClient } from "@prisma/client";
import { UserController } from "./interface/controllers/UserController";
import { ArticleController } from "./interface/controllers/ArticleController";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaArticleRepository } from "./infrastructure/repositories/PrismaArticleRepository";
import { UserApplicationService } from "./application/services/UserApplicationService";
import { ArticleApplicationService } from "./application/services/ArticleApplicationService";

// Initialize Express application
const app = express();

// Middleware setup
app.use(json());

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize repositories
const userRepository = new PrismaUserRepository(prisma);
const articleRepository = new PrismaArticleRepository(prisma);

// Initialize application services
const userApplicationService = new UserApplicationService(userRepository);
const articleApplicationService = new ArticleApplicationService(articleRepository);

// Initialize controllers
const userController = new UserController(userApplicationService);
const articleController = new ArticleController(articleApplicationService);

// Register routes
app.post("/users", userController.create.bind(userController));
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
