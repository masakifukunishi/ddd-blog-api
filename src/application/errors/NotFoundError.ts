import { DomainError } from "./DomainError";

export class NotFoundError extends DomainError {
  constructor(entity: string, id: number | string) {
    super(`${entity} with id ${id} not found`);
  }
}
