import { User } from "../../domain/models/user/User.js";
import { EmailAddress } from "../../domain/models/user/EmailAddress.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { UserDomainService } from "../../domain/services/UserDomainService.js";
import { CreateUserCommand } from "../commands/CreateUserCommand.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { DuplicateResourceError } from "../errors/DuplicateResourceError.js";

export class UserApplicationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

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
