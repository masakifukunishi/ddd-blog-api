import { DomainError } from "./DomainError.js";

export class NotAuthorizedError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
