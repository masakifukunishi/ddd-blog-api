import { Article } from "../models/article/Article";

export interface ArticleRepository {
  save(article: Article): Promise<Article>;
  findById(id: number): Promise<Article | null>;
  findByUserId(userId: number): Promise<Article[]>;
  delete(id: number): Promise<void>;
}
