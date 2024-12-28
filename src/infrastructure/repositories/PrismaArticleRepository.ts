import { Article } from "../../domain/models/article/Article.js";
import { IArticleRepository } from "../../domain/repositories/IArticleRepository.js";
import { PrismaClient } from "@prisma/client";

export class PrismaArticleRepository implements IArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(article: Article): Promise<Article> {
    const data = {
      title: article.getTitle(),
      content: article.getContent(),
      userId: article.getUserId(),
    };

    const id = article.getId();
    if (id === null) {
      const created = await this.prisma.article.create({
        data,
      });
      return new Article(created.id, created.title, created.content, created.userId, created.createdAt);
    } else {
      const updated = await this.prisma.article.update({
        where: { id },
        data,
      });
      return new Article(updated.id, updated.title, updated.content, updated.userId, updated.createdAt);
    }
  }

  async findById(id: number): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) return null;

    return new Article(article.id, article.title, article.content, article.userId, article.createdAt);
  }

  async findByUserId(userId: number): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: { userId },
    });

    return articles.map(
      (article: { id: number; title: string; content: string; userId: number; createdAt: Date }) =>
        new Article(article.id, article.title, article.content, article.userId, article.createdAt)
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }
}
