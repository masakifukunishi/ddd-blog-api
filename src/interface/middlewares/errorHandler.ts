import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../application/errors/NotFoundError.js";
import { NotAuthorizedError } from "../../application/errors/NotAuthorizedError.js";
import { ValidationError } from "../../application/errors/ValidationError.js";
import { DuplicateResourceError } from "../../application/errors/DuplicateResourceError.js";
import { DomainError } from "../../application/errors/DomainError.js";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof ValidationError) {
    res.status(400).json({
      errors: error.errors.map((err) => ({
        type: "field",
        value: err.value,
        msg: err.message,
        path: err.field,
        location: "body",
      })),
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      errors: [
        {
          type: "resource",
          msg: error.message,
          path: "id",
          location: "params",
        },
      ],
    });
    return;
  }

  if (error instanceof NotAuthorizedError) {
    res.status(403).json({
      errors: [
        {
          type: "authorization",
          msg: error.message,
          path: "authorization",
          location: "headers",
        },
      ],
    });
    return;
  }

  if (error instanceof DuplicateResourceError) {
    res.status(409).json({
      errors: [
        {
          type: "field",
          value: error.value,
          msg: error.message,
          path: error.field,
          location: "body",
        },
      ],
    });
    return;
  }

  if (error instanceof DomainError) {
    res.status(400).json({
      errors: [
        {
          type: "domain",
          msg: error.message,
          path: "body",
          location: "body",
        },
      ],
    });
    return;
  }

  console.error("Unexpected error:", error);
  res.status(500).json({
    errors: [
      {
        type: "server",
        msg: "Internal server error",
        path: "server",
        location: "server",
      },
    ],
  });
}
