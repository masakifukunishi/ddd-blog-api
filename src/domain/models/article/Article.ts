export class Article {
  private readonly id: string;
  private title: string;
  private content: string;
  private readonly userId: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, title: string, content: string, userId: string, createdAt: Date = new Date(), updatedAt: Date = new Date()) {
    this.validateTitle(title);
    this.validateContent(content);
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  private validateTitle(title: string): void {
    if (title.length < 1 || title.length > 200) {
      throw new Error("Title must be between 1 and 200 characters");
    }
  }

  private validateContent(content: string): void {
    if (content.length < 1 || content.length > 10000) {
      throw new Error("Content must be between 1 and 10000 characters");
    }
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getUserId(): string {
    return this.userId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateTitle(title: string): void {
    this.validateTitle(title);
    this.title = title;
    this.updatedAt = new Date();
  }

  updateContent(content: string): void {
    this.validateContent(content);
    this.content = content;
    this.updatedAt = new Date();
  }
}
