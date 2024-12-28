import express from "express";
import { json } from "express";
import { errorHandler } from "./interface/middlewares/errorHandler.js";
import { UserController } from "./interface/controllers/UserController.js";
import { ArticleController } from "./interface/controllers/ArticleController.js";
import { userRouter } from "./interface/routes/userRoutes.js";
import { articleRouter } from "./interface/routes/articleRoutes.js";
import { UserApplicationService } from "./application/services/UserApplicationService.js";
import { ArticleApplicationService } from "./application/services/ArticleApplicationService.js";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository.js";
import { PrismaArticleRepository } from "./infrastructure/repositories/PrismaArticleRepository.js";
import { UserDomainService } from "./domain/services/UserDomainService.js";
import { prisma } from "./infrastructure/prisma/client.js";

async function bootstrap() {
  const app = express();
  app.use(json());

  // Initialize repositories
  const userRepository = new PrismaUserRepository(prisma);
  const articleRepository = new PrismaArticleRepository(prisma);

  // Initialize domain services
  const userDomainService = new UserDomainService(userRepository);

  // Initialize application services
  const userApplicationService = new UserApplicationService(userRepository, userDomainService);
  const articleApplicationService = new ArticleApplicationService(articleRepository, userRepository);

  // Initialize controllers
  const userController = new UserController(userApplicationService);
  const articleController = new ArticleController(articleApplicationService);

  app.use("/api/users", userRouter(userController));
  app.use("/api/articles", articleRouter(articleController));

  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap().catch(console.error);
