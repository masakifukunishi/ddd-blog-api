import { Article } from "../../domain/models/article/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { CreateArticleCommand } from "../commands/CreateArticleCommand";

export class ArticleApplicationService {
  constructor(private readonly articleRepository: ArticleRepository, private readonly userRepository: UserRepository) {}

  async createArticle(command: CreateArticleCommand): Promise<Article> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const article = new Article(null, command.title, command.content, command.userId);

    return await this.articleRepository.save(article);
  }

  async getArticle(id: number): Promise<Article | null> {
    return await this.articleRepository.findById(id);
  }

  async getUserArticles(userId: number): Promise<Article[]> {
    return await this.articleRepository.findByUserId(userId);
  }

  async deleteArticle(id: number, userId: number): Promise<void> {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new Error("Article not found");
    }

    if (article.getUserId() !== userId) {
      throw new Error("Not authorized to delete this article");
    }

    await this.articleRepository.delete(id);
  }
}
