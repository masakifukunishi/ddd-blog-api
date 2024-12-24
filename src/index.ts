import express from "express";
import { json } from "express";
import { UserController } from "./interface/controllers/UserController";
import { ArticleController } from "./interface/controllers/ArticleController";
import { UserApplicationService } from "./application/services/UserApplicationService";
import { ArticleApplicationService } from "./application/services/ArticleApplicationService";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaArticleRepository } from "./infrastructure/repositories/PrismaArticleRepository";
import { UserDomainService } from "./domain/services/UserDomainService";

async function bootstrap() {
  const app = express();
  app.use(json());

  // Initialize repositories
  const userRepository = new PrismaUserRepository();
  const articleRepository = new PrismaArticleRepository();

  // Initialize domain services
  const userDomainService = new UserDomainService(userRepository);

  // Initialize application services
  const userApplicationService = new UserApplicationService(userRepository, userDomainService);
  const articleApplicationService = new ArticleApplicationService(articleRepository, userRepository);

  // Initialize controllers
  const userController = new UserController(userApplicationService);
  const articleController = new ArticleController(articleApplicationService);

  // User-related routes
  app.post("/users", UserController.validations.createUser, userController.create.bind(userController));
  app.get("/users/:id", userController.get.bind(userController));
  app.delete("/users/:id", userController.delete.bind(userController));

  // Article-related routes
  app.post("/articles", ArticleController.validations.createArticle, articleController.create.bind(articleController));
  app.get("/articles/:id", articleController.get.bind(articleController));
  app.get("/users/:userId/articles", articleController.getUserArticles.bind(articleController));
  app.delete("/articles/:id/users/:userId", articleController.delete.bind(articleController));

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap().catch(console.error);
