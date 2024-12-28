import { IUserRepository } from "../repositories/IUserRepository.js";
import { EmailAddress } from "../models/user/EmailAddress.js";

export class UserDomainService {
  constructor(private readonly userRepository: IUserRepository) {}

  async isEmailDuplicated(email: EmailAddress): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser !== null;
  }
}
