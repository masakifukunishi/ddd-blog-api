import { Article } from "../models/article/Article.js";

export interface IArticleRepository {
  save(article: Article): Promise<Article>;
  findById(id: number): Promise<Article | null>;
  findByUserId(userId: number): Promise<Article[]>;
  delete(id: number): Promise<void>;
}
