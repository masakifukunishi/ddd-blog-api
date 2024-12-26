import { IUserRepository } from "../repositories/IUserRepository";
import { EmailAddress } from "../models/user/EmailAddress";

export class UserDomainService {
  constructor(private readonly userRepository: IUserRepository) {}

  async isEmailDuplicated(email: EmailAddress): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser !== null;
  }
}
