import { describe, it, expect } from "vitest";
import { User } from "../../../../../src/domain/models/user/User";
import { EmailAddress } from "../../../../../src/domain/models/user/EmailAddress";

describe("User", () => {
  const validEmail = new EmailAddress("test@example.com");

  it("should create a user with valid data", () => {
    const user = new User(1, "John Doe", validEmail);

    expect(user.getId()).toBe(1);
    expect(user.getName()).toBe("John Doe");
    expect(user.getEmail().getValue()).toBe("test@example.com");
  });

  it("should throw error for empty name", () => {
    expect(() => new User(1, "", validEmail)).toThrow();

    expect(() => new User(1, "   ", validEmail)).toThrow();
  });

  it("should allow changing name to valid value", () => {
    const user = new User(1, "John Doe", validEmail);
    user.changeName("Jane Doe");
    expect(user.getName()).toBe("Jane Doe");
  });

  it("should throw error when changing to invalid name", () => {
    const user = new User(1, "John Doe", validEmail);
    expect(() => user.changeName("")).toThrow();
  });
});
