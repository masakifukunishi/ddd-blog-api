import { Request, Response } from "express";
import { ArticleApplicationService } from "../../application/services/ArticleApplicationService.js";
import { CreateArticleCommand } from "../../application/commands/CreateArticleCommand.js";

export class ArticleController {
  constructor(private readonly articleApplicationService: ArticleApplicationService) {}

  async create(req: Request, res: Response): Promise<void> {
    const command = new CreateArticleCommand(req.body.title, req.body.content, parseInt(req.body.userId));

    const article = await this.articleApplicationService.createArticle(command);
    res.status(201).json(article);
  }

  async get(req: Request, res: Response): Promise<void> {
    const articleId = parseInt(req.params.id);
    const article = await this.articleApplicationService.getArticle(articleId);
    res.json(article);
  }

  async getUserArticles(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId);
    const articles = await this.articleApplicationService.getUserArticles(userId);
    res.json(articles);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const articleId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    await this.articleApplicationService.deleteArticle(articleId, userId);
    res.status(204).send();
  }
}
