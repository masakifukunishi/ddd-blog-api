import { describe, it, expect } from "vitest";
import { EmailAddress } from "../../../../../src/domain/models/user/EmailAddress";

describe("EmailAddress", () => {
  it("should create a valid email address", () => {
    const email = new EmailAddress("test@example.com");
    expect(email.getValue()).toBe("test@example.com");
  });

  it("should throw error for invalid email format", () => {
    expect(() => new EmailAddress("invalid-email")).toThrow();
    expect(() => new EmailAddress("")).toThrow();
  });

  it("should compare email addresses correctly", () => {
    const email1 = new EmailAddress("test@example.com");
    const email2 = new EmailAddress("test@example.com");
    const email3 = new EmailAddress("other@example.com");

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});
