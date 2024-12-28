import { DomainError } from "./DomainError.js";

export class NotFoundError extends DomainError {
  constructor(entity: string, id: number | string) {
    super(`${entity} with id ${id} not found`);
  }
}
