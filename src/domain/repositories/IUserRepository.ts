import { User } from "../models/user/User";
import { EmailAddress } from "../models/user/EmailAddress";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: EmailAddress): Promise<User | null>;
  delete(id: number): Promise<void>;
}
