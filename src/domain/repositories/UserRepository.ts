import { User } from "../models/user/User";
import { EmailAddress } from "../models/user/EmailAddress";

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: EmailAddress): Promise<User | null>;
  delete(id: string): Promise<void>;
}
