import { describe, it, expect, beforeEach } from "vitest";
import { ArticleApplicationService } from "../../../../src/application/services/ArticleApplicationService";
import { CreateArticleCommand } from "../../../../src/application/commands/CreateArticleCommand";
import { NotFoundError } from "../../../../src/application/errors/NotFoundError";
import { NotAuthorizedError } from "../../../../src/application/errors/NotAuthorizedError";
import { Article } from "../../../../src/domain/models/article/Article";
import { User } from "../../../../src/domain/models/user/User";
import { EmailAddress } from "../../../../src/domain/models/user/EmailAddress";
import { MockArticleRepository } from "../../../helpers/mocks/MockArticleRepository";
import { MockUserRepository } from "../../../helpers/mocks/MockUserRepository";

describe("ArticleApplicationService", () => {
  let articleRepository: MockArticleRepository;
  let userRepository: MockUserRepository;
  let articleApplicationService: ArticleApplicationService;
  let testUser: User;

  beforeEach(async () => {
    articleRepository = new MockArticleRepository();
    userRepository = new MockUserRepository();
    articleApplicationService = new ArticleApplicationService(articleRepository, userRepository);

    // テストユーザーを作成
    testUser = new User(1, "John Doe", new EmailAddress("john@example.com"));
    await userRepository.save(testUser);
  });

  describe("createArticle", () => {
    it("should create a new article", async () => {
      const command = new CreateArticleCommand("Test Article", "Test Content", testUser.getId()!);

      const article = await articleApplicationService.createArticle(command);

      expect(article.getTitle()).toBe("Test Article");
      expect(article.getContent()).toBe("Test Content");
      expect(article.getUserId()).toBe(testUser.getId());
    });

    it("should throw NotFoundError when user does not exist", async () => {
      const command = new CreateArticleCommand("Test Article", "Test Content", 999);

      await expect(articleApplicationService.createArticle(command)).rejects.toThrow(NotFoundError);
    });
  });

  describe("getArticle", () => {
    it("should return article when exists", async () => {
      const article = new Article(1, "Test Article", "Test Content", testUser.getId()!);
      await articleRepository.save(article);

      const foundArticle = await articleApplicationService.getArticle(1);
      expect(foundArticle).not.toBeNull();
      expect(foundArticle?.getTitle()).toBe("Test Article");
    });

    it("should return null when article does not exist", async () => {
      const article = await articleApplicationService.getArticle(999);
      expect(article).toBeNull();
    });
  });

  describe("deleteArticle", () => {
    it("should delete article when user is owner", async () => {
      const article = new Article(1, "Test Article", "Test Content", testUser.getId()!);
      await articleRepository.save(article);

      await articleApplicationService.deleteArticle(1, testUser.getId()!);
      const deletedArticle = await articleRepository.findById(1);
      expect(deletedArticle).toBeNull();
    });

    it("should throw NotFoundError when article does not exist", async () => {
      await expect(articleApplicationService.deleteArticle(999, testUser.getId()!)).rejects.toThrow(NotFoundError);
    });

    it("should throw NotAuthorizedError when user is not owner", async () => {
      const article = new Article(1, "Test Article", "Test Content", testUser.getId()!);
      await articleRepository.save(article);

      await expect(articleApplicationService.deleteArticle(1, 999)).rejects.toThrow(NotAuthorizedError);
    });
  });

  describe("getUserArticles", () => {
    it("should return user articles", async () => {
      const article1 = new Article(1, "Article 1", "Content 1", testUser.getId()!);
      const article2 = new Article(2, "Article 2", "Content 2", testUser.getId()!);
      await articleRepository.save(article1);
      await articleRepository.save(article2);

      const articles = await articleApplicationService.getUserArticles(testUser.getId()!);
      expect(articles).toHaveLength(2);
      expect(articles[0].getTitle()).toBe("Article 1");
      expect(articles[1].getTitle()).toBe("Article 2");
    });

    it("should return empty array when user has no articles", async () => {
      const articles = await articleApplicationService.getUserArticles(testUser.getId()!);
      expect(articles).toHaveLength(0);
    });
  });
});
