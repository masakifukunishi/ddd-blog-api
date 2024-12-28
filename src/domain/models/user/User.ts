import { EmailAddress } from "./EmailAddress.js";

export class User {
  constructor(private readonly id: number | null, private name: string, private email: EmailAddress) {
    this.validateName(name);
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
  }

  getId(): number | null {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): EmailAddress {
    return this.email;
  }

  changeName(newName: string): void {
    this.validateName(newName);
    this.name = newName;
  }
}
