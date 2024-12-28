import { describe, it, expect, beforeEach } from "vitest";
import { UserApplicationService } from "../../../../src/application/services/UserApplicationService";
import { UserDomainService } from "../../../../src/domain/services/UserDomainService";
import { CreateUserCommand } from "../../../../src/application/commands/CreateUserCommand";
import { NotFoundError } from "../../../../src/application/errors/NotFoundError";
import { DuplicateResourceError } from "../../../../src/application/errors/DuplicateResourceError";
import { EmailAddress } from "../../../../src/domain/models/user/EmailAddress";
import { User } from "../../../../src/domain/models/user/User";
import { MockUserRepository } from "../../../helpers/mocks/MockUserRepository";

describe("UserApplicationService", () => {
  let userRepository: MockUserRepository;
  let userDomainService: UserDomainService;
  let userApplicationService: UserApplicationService;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    userDomainService = new UserDomainService(userRepository);
    userApplicationService = new UserApplicationService(userRepository, userDomainService);
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const command = new CreateUserCommand("John Doe", "john@example.com");
      const user = await userApplicationService.createUser(command);

      expect(user.getName()).toBe("John Doe");
      expect(user.getEmail().getValue()).toBe("john@example.com");
      expect(user.getId()).toBeDefined();
    });

    it("should throw DuplicateResourceError when creating user with duplicate email", async () => {
      const email = "john@example.com";
      const command1 = new CreateUserCommand("John Doe", email);
      await userApplicationService.createUser(command1);

      const command2 = new CreateUserCommand("Jane Doe", email);
      await expect(userApplicationService.createUser(command2)).rejects.toThrow(DuplicateResourceError);
    });
  });

  describe("getUser", () => {
    it("should return user when exists", async () => {
      const email = new EmailAddress("john@example.com");
      const createdUser = new User(1, "John Doe", email);
      await userRepository.save(createdUser);

      const user = await userApplicationService.getUser(1);
      expect(user.getName()).toBe("John Doe");
    });

    it("should throw NotFoundError when user does not exist", async () => {
      await expect(userApplicationService.getUser(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteUser", () => {
    it("should delete existing user", async () => {
      const email = new EmailAddress("john@example.com");
      const user = new User(1, "John Doe", email);
      await userRepository.save(user);

      await userApplicationService.deleteUser(1);
      const foundUser = await userRepository.findById(1);
      expect(foundUser).toBeNull();
    });

    it("should throw NotFoundError when deleting non-existent user", async () => {
      await expect(userApplicationService.deleteUser(999)).rejects.toThrow(NotFoundError);
    });
  });
});
