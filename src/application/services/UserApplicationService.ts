import { User } from "../../domain/models/user/User";
import { EmailAddress } from "../../domain/models/user/EmailAddress";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserDomainService } from "../../domain/services/UserDomainService";
import { CreateUserCommand } from "../commands/CreateUserCommand";

export class UserApplicationService {
  constructor(private readonly userRepository: UserRepository, private readonly userDomainService: UserDomainService) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    const emailAddress = new EmailAddress(command.email);

    const isDuplicated = await this.userDomainService.isEmailDuplicated(emailAddress);
    if (isDuplicated) {
      throw new Error("Email address is already in use");
    }

    const user = new User(null, command.name, emailAddress);

    return await this.userRepository.save(user);
  }

  async getUser(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await this.userRepository.delete(id);
  }
}
