import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../application/errors/NotFoundError";
import { NotAuthorizedError } from "../../application/errors/NotAuthorizedError";
import { ValidationError } from "../../application/errors/ValidationError";
import { DuplicateResourceError } from "../../application/errors/DuplicateResourceError";
import { DomainError } from "../../application/errors/DomainError";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof ValidationError) {
    res.status(400).json({
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });
    return;
  }

  if (error instanceof NotAuthorizedError) {
    res.status(403).json({ message: error.message });
    return;
  }

  if (error instanceof DuplicateResourceError) {
    res.status(409).json({
      message: error.message,
      resourceType: error.resourceType,
      field: error.field,
      value: error.value,
    });
    return;
  }

  if (error instanceof DomainError) {
    res.status(400).json({ message: error.message });
    return;
  }

  console.error("Unexpected error:", error);
  res.status(500).json({ message: "Internal server error" });
}
