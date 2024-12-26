import { Router, Request, Response, NextFunction } from "express";
import { ArticleController } from "../controllers/ArticleController";
import { articleValidation } from "../middlewares/validations/articleValidation";
import { validateRequest } from "../middlewares/validateRequest";

export const articleRouter = (articleController: ArticleController): Router => {
  const router = Router();

  router.post("/", articleValidation.createArticle, validateRequest, (req: Request, res: Response, next: NextFunction) =>
    articleController.create(req, res).catch(next)
  );
  router.get("/:id", (req: Request, res: Response, next: NextFunction) => articleController.get(req, res).catch(next));
  router.get("/user/:userId", (req: Request, res: Response, next: NextFunction) => articleController.getUserArticles(req, res).catch(next));
  router.delete("/:id/user/:userId", (req: Request, res: Response, next: NextFunction) => articleController.delete(req, res).catch(next));

  return router;
};
