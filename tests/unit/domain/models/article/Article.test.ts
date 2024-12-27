import { describe, it, expect } from "vitest";
import { Article } from "../../../../../src/domain/models/article/Article";

describe("Article", () => {
  const validUserId = 1;
  const validTitle = "Test Article";
  const validContent = "Test Content";

  it("should create an article with valid data", () => {
    const article = new Article(1, validTitle, validContent, validUserId);

    expect(article.getId()).toBe(1);
    expect(article.getTitle()).toBe(validTitle);
    expect(article.getContent()).toBe(validContent);
    expect(article.getUserId()).toBe(validUserId);
  });

  it("should throw error for empty title", () => {
    expect(() => new Article(1, "", validContent, validUserId)).toThrow();
  });

  it("should throw error for title longer than 100 characters", () => {
    const longTitle = "a".repeat(101);
    expect(() => new Article(1, longTitle, validContent, validUserId)).toThrow();
  });

  it("should throw error for empty content", () => {
    expect(() => new Article(1, validTitle, "", validUserId)).toThrow();
  });

  it("should allow updating title and content with valid values", () => {
    const article = new Article(1, validTitle, validContent, validUserId);

    const newTitle = "Updated Title";
    const newContent = "Updated Content";

    article.updateTitle(newTitle);
    article.updateContent(newContent);

    expect(article.getTitle()).toBe(newTitle);
    expect(article.getContent()).toBe(newContent);
  });
});
