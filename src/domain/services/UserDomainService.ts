import { UserRepository } from "../repositories/UserRepository";
import { EmailAddress } from "../models/user/EmailAddress";

export class UserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  async isEmailDuplicated(email: EmailAddress): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser !== null;
  }
}
