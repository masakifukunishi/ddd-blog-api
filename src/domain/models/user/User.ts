import { EmailAddress } from "./EmailAddress";

export class User {
  private readonly id: string;
  private name: string;
  private emailAddress: EmailAddress;

  constructor(id: string, name: string, emailAddress: EmailAddress) {
    this.validateName(name);
    this.id = id;
    this.name = name;
    this.emailAddress = emailAddress;
  }

  private validateName(name: string): void {
    if (name.length < 1 || name.length > 100) {
      throw new Error("Name must be between 1 and 100 characters");
    }
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmailAddress(): EmailAddress {
    return this.emailAddress;
  }

  updateName(name: string): void {
    this.validateName(name);
    this.name = name;
  }
}
