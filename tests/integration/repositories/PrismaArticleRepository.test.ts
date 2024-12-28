import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaArticleRepository } from "../../../src/infrastructure/repositories/PrismaArticleRepository";
import { Article } from "../../../src/domain/models/article/Article";
import { EmailAddress } from "../../../src/domain/models/user/EmailAddress";
import { User } from "../../../src/domain/models/user/User";
import { PrismaUserRepository } from "../../../src/infrastructure/repositories/PrismaUserRepository";
import { setupTestDatabase } from "../../helpers/setup-test-db";

describe("PrismaArticleRepository", () => {
  let prisma: PrismaClient;
  let articleRepository: PrismaArticleRepository;
  let userRepository: PrismaUserRepository;
  let testUser: User;

  beforeEach(async () => {
    prisma = await setupTestDatabase();
    articleRepository = new PrismaArticleRepository();
    userRepository = new PrismaUserRepository();

    await prisma.article.deleteMany();
    await prisma.user.deleteMany();

    const email = new EmailAddress("test@example.com");
    const user = new User(null, "Test User", email);
    testUser = await userRepository.save(user);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("save", () => {
    it("should create a new article", async () => {
      const article = new Article(null, "Test Article", "Test Content", testUser.getId()!);

      const savedArticle = await articleRepository.save(article);

      expect(savedArticle.getId()).toBeDefined();
      expect(savedArticle.getTitle()).toBe("Test Article");
      expect(savedArticle.getUserId()).toBe(testUser.getId());

      const dbArticle = await prisma.article.findUnique({
        where: { id: savedArticle.getId()! },
      });
      expect(dbArticle).not.toBeNull();
      expect(dbArticle!.title).toBe("Test Article");
    });

    it("should update existing article", async () => {
      const article = new Article(null, "Test Article", "Test Content", testUser.getId()!);
      const savedArticle = await articleRepository.save(article);

      const updatedArticle = new Article(savedArticle.getId(), "Updated Title", "Updated Content", testUser.getId()!);
      await articleRepository.save(updatedArticle);

      const dbArticle = await prisma.article.findUnique({
        where: { id: savedArticle.getId()! },
      });
      expect(dbArticle!.title).toBe("Updated Title");
      expect(dbArticle!.content).toBe("Updated Content");
    });
  });

  describe("findById", () => {
    it("should find article by id", async () => {
      const article = new Article(null, "Test Article", "Test Content", testUser.getId()!);
      const savedArticle = await articleRepository.save(article);

      const foundArticle = await articleRepository.findById(savedArticle.getId()!);
      expect(foundArticle).not.toBeNull();
      expect(foundArticle!.getTitle()).toBe("Test Article");
    });

    it("should return null for non-existent id", async () => {
      const article = await articleRepository.findById(999);
      expect(article).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("should find articles by user id", async () => {
      const article1 = new Article(null, "Article 1", "Content 1", testUser.getId()!);
      const article2 = new Article(null, "Article 2", "Content 2", testUser.getId()!);
      await articleRepository.save(article1);
      await articleRepository.save(article2);

      const articles = await articleRepository.findByUserId(testUser.getId()!);
      expect(articles).toHaveLength(2);
      expect(articles[0].getTitle()).toBe("Article 1");
      expect(articles[1].getTitle()).toBe("Article 2");
    });

    it("should return empty array for user with no articles", async () => {
      const articles = await articleRepository.findByUserId(999);
      expect(articles).toHaveLength(0);
    });
  });

  describe("delete", () => {
    it("should delete article", async () => {
      const article = new Article(null, "Test Article", "Test Content", testUser.getId()!);
      const savedArticle = await articleRepository.save(article);

      await articleRepository.delete(savedArticle.getId()!);

      const dbArticle = await prisma.article.findUnique({
        where: { id: savedArticle.getId()! },
      });
      expect(dbArticle).toBeNull();
    });
  });
});
