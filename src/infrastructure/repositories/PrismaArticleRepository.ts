import { Article } from "../../domain/models/article/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import { prisma } from "../prisma/client";

export class PrismaArticleRepository implements ArticleRepository {
  async save(article: Article): Promise<Article> {
    const data = {
      title: article.getTitle(),
      content: article.getContent(),
      userId: article.getUserId(),
    };

    if (article.getId() === null) {
      const created = await prisma.article.create({
        data,
      });

      return new Article(created.id, created.title, created.content, created.userId, created.createdAt);
    } else {
      const updated = await prisma.article.update({
        where: { id: article.getId() },
        data,
      });

      return new Article(updated.id, updated.title, updated.content, updated.userId, updated.createdAt);
    }
  }

  async findById(id: number): Promise<Article | null> {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) return null;

    return new Article(article.id, article.title, article.content, article.userId, article.createdAt);
  }

  async findByUserId(userId: number): Promise<Article[]> {
    const articles = await prisma.article.findMany({
      where: { userId },
    });

    return articles.map(
      (article: { id: number; title: string; content: string; userId: number; createdAt: Date }) =>
        new Article(article.id, article.title, article.content, article.userId, article.createdAt)
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.article.delete({
      where: { id },
    });
  }
}
