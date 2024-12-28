import { Article } from "../../../src/domain/models/article/Article";
import { IArticleRepository } from "../../../src/domain/repositories/IArticleRepository";

export class MockArticleRepository implements IArticleRepository {
  private articles: Article[] = [];

  async save(article: Article): Promise<Article> {
    const newArticle = new Article(
      article.getId() || this.articles.length + 1,
      article.getTitle(),
      article.getContent(),
      article.getUserId(),
      article.getCreatedAt()
    );
    this.articles.push(newArticle);
    return newArticle;
  }

  async findById(id: number): Promise<Article | null> {
    return this.articles.find((article) => article.getId() === id) || null;
  }

  async findByUserId(userId: number): Promise<Article[]> {
    return this.articles.filter((article) => article.getUserId() === userId);
  }

  async delete(id: number): Promise<void> {
    this.articles = this.articles.filter((article) => article.getId() !== id);
  }
}
