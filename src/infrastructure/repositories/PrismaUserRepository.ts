import { User } from "../../domain/models/user/User";
import { EmailAddress } from "../../domain/models/user/EmailAddress";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { prisma } from "../prisma/client";

export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    const data = {
      name: user.getName(),
      email: user.getEmail().getValue(),
    };

    if (user.getId() === null) {
      const created = await prisma.user.create({
        data,
      });

      return new User(created.id, created.name, new EmailAddress(created.email));
    } else {
      const updated = await prisma.user.update({
        where: { id: user.getId() },
        data,
      });

      return new User(updated.id, updated.name, new EmailAddress(updated.email));
    }
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(user.id, user.name, new EmailAddress(user.email));
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!user) return null;

    return new User(user.id, user.name, new EmailAddress(user.email));
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
