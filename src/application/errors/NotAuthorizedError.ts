import { DomainError } from "./DomainError";

export class NotAuthorizedError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
