import { User } from "../../domain/models/user/User";
import { EmailAddress } from "../../domain/models/user/EmailAddress";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserDomainService } from "../../domain/services/UserDomainService";
import { CreateUserCommand } from "../commands/CreateUserCommand";
import { NotFoundError } from "../errors/NotFoundError";
import { DuplicateResourceError } from "../errors/DuplicateResourceError";

export class UserApplicationService {
  constructor(private readonly userRepository: UserRepository, private readonly userDomainService: UserDomainService) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    const emailAddress = new EmailAddress(command.email);

    const isDuplicated = await this.userDomainService.isEmailDuplicated(emailAddress);
    if (isDuplicated) {
      throw new DuplicateResourceError("User", "email", command.email);
    }

    const user = new User(null, command.name, emailAddress);
    return await this.userRepository.save(user);
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User", id);
    }
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User", id);
    }
    await this.userRepository.delete(id);
  }
}
