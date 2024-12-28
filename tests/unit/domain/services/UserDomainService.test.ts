import { describe, it, expect, beforeEach } from "vitest";
import { UserDomainService } from "../../../../src/domain/services/UserDomainService";
import { EmailAddress } from "../../../../src/domain/models/user/EmailAddress";
import { MockUserRepository } from "../../../helpers/mocks/MockUserRepository";
import { User } from "../../../../src/domain/models/user/User";

describe("UserDomainService", () => {
  let userRepository: MockUserRepository;
  let userDomainService: UserDomainService;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    userDomainService = new UserDomainService(userRepository);
  });

  it("should return false for non-existent email", async () => {
    const email = new EmailAddress("test@example.com");
    const isDuplicated = await userDomainService.isEmailDuplicated(email);
    expect(isDuplicated).toBe(false);
  });

  it("should return true for duplicate email", async () => {
    const email = new EmailAddress("test@example.com");
    const user = new User(1, "John Doe", email);
    await userRepository.save(user);

    const isDuplicated = await userDomainService.isEmailDuplicated(email);
    expect(isDuplicated).toBe(true);
  });
});
