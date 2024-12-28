import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "../../../src/infrastructure/repositories/PrismaUserRepository";
import { User } from "../../../src/domain/models/user/User";
import { EmailAddress } from "../../../src/domain/models/user/EmailAddress";
import { setupTestDatabase } from "../../helpers/setup-test-db";

describe("PrismaUserRepository", () => {
  let prisma: PrismaClient;
  let userRepository: PrismaUserRepository;

  beforeEach(async () => {
    prisma = await setupTestDatabase();
    userRepository = new PrismaUserRepository();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("save", () => {
    it("should create a new user", async () => {
      const email = new EmailAddress("test@example.com");
      const user = new User(null, "Test User", email);

      const savedUser = await userRepository.save(user);

      expect(savedUser.getId()).toBeDefined();
      expect(savedUser.getName()).toBe("Test User");
      expect(savedUser.getEmail().getValue()).toBe("test@example.com");

      const dbUser = await prisma.user.findUnique({
        where: { id: savedUser.getId()! },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser!.email).toBe("test@example.com");
    });

    it("should update existing user", async () => {
      const email = new EmailAddress("test@example.com");
      const user = new User(null, "Test User", email);
      const savedUser = await userRepository.save(user);

      const updatedUser = new User(savedUser.getId(), "Updated Name", savedUser.getEmail());
      await userRepository.save(updatedUser);

      const dbUser = await prisma.user.findUnique({
        where: { id: savedUser.getId()! },
      });
      expect(dbUser!.name).toBe("Updated Name");
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      const email = new EmailAddress("test@example.com");
      const user = new User(null, "Test User", email);
      const savedUser = await userRepository.save(user);

      const foundUser = await userRepository.findById(savedUser.getId()!);
      expect(foundUser).not.toBeNull();
      expect(foundUser!.getName()).toBe("Test User");
    });

    it("should return null for non-existent id", async () => {
      const user = await userRepository.findById(999);
      expect(user).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const email = new EmailAddress("test@example.com");
      const user = new User(null, "Test User", email);
      await userRepository.save(user);

      const foundUser = await userRepository.findByEmail(email);
      expect(foundUser).not.toBeNull();
      expect(foundUser!.getName()).toBe("Test User");
    });

    it("should return null for non-existent email", async () => {
      const email = new EmailAddress("nonexistent@example.com");
      const user = await userRepository.findByEmail(email);
      expect(user).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      const email = new EmailAddress("test@example.com");
      const user = new User(null, "Test User", email);
      const savedUser = await userRepository.save(user);

      await userRepository.delete(savedUser.getId()!);

      const dbUser = await prisma.user.findUnique({
        where: { id: savedUser.getId()! },
      });
      expect(dbUser).toBeNull();
    });
  });
});
