import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ArticleApplicationService } from "../../application/services/ArticleApplicationService";
import { CreateArticleCommand } from "../../application/commands/CreateArticleCommand";
import { NotFoundError } from "../../application/errors/NotFoundError";
import { NotAuthorizedError } from "../../application/errors/NotAuthorizedError";

export class ArticleController {
  constructor(private readonly articleApplicationService: ArticleApplicationService) {}

  static validations = {
    createArticle: [
      body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters"),
      body("content").notEmpty().withMessage("Content is required"),
      body("userId").isInt().withMessage("Valid user ID is required"),
    ],
  };

  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const command = new CreateArticleCommand(req.body.title, req.body.content, parseInt(req.body.userId));

      const article = await this.articleApplicationService.createArticle(command);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const articleId = parseInt(req.params.id);
      const article = await this.articleApplicationService.getArticle(articleId);

      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUserArticles(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const articles = await this.articleApplicationService.getUserArticles(userId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const articleId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);

      await this.articleApplicationService.deleteArticle(articleId, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof NotAuthorizedError) {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
