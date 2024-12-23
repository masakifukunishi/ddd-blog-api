import { Article } from "../models/article/Article";

export interface ArticleRepository {
  save(article: Article): Promise<void>;
  findById(id: string): Promise<Article | null>;
  findByUserId(userId: string): Promise<Article[]>;
  delete(id: string): Promise<void>;
}
