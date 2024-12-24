import { DomainError } from "./DomainError";
import { ValidationError as ExpressValidationError } from "express-validator";

export class ValidationError extends DomainError {
  constructor(public readonly errors: ExpressValidationError[]) {
    super("Validation failed");
  }
}
