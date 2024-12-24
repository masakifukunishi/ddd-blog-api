export class EmailAddress {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email;
  }

  private validate(email: string): void {
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email format");
    }
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }
}
