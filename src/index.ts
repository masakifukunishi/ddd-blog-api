import express from "express";
import { json } from "express";
import { errorHandler } from "./interface/middlewares/errorHandler";
import { UserController } from "./interface/controllers/UserController";
import { ArticleController } from "./interface/controllers/ArticleController";
import { userRouter } from "./interface/routes/userRoutes";
import { articleRouter } from "./interface/routes/articleRoutes";
import { UserApplicationService } from "./application/services/UserApplicationService";
import { ArticleApplicationService } from "./application/services/ArticleApplicationService";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaArticleRepository } from "./infrastructure/repositories/PrismaArticleRepository";
import { UserDomainService } from "./domain/services/UserDomainService";
import { prisma } from "./infrastructure/prisma/client";

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
