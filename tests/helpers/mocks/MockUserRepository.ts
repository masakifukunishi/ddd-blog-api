import { User } from "../../../src/domain/models/user/User";
import { EmailAddress } from "../../../src/domain/models/user/EmailAddress";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";

export class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    const newUser = new User(user.getId() || this.users.length + 1, user.getName(), user.getEmail());
    this.users.push(newUser);
    return newUser;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find((user) => user.getId() === id) || null;
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    return this.users.find((user) => user.getEmail().equals(email)) || null;
  }

  async delete(id: number): Promise<void> {
    this.users = this.users.filter((user) => user.getId() !== id);
  }
}
