import { UserRepository } from "../repositories/UserRepository";
import { EmailAddress } from "../models/user/EmailAddress";

export class UserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  async isEmailAvailable(email: EmailAddress): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser === null;
  }
}
