import { body, param } from "express-validator";
import { handleValidationErrors } from "./ValidationHandler";

export const validateCreateArticle = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be less than 200 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  handleValidationErrors,
];

export const validateDeleteArticle = [
  param("id").notEmpty().withMessage("Article ID is required").isString().withMessage("Article ID must be a string"),

  handleValidationErrors,
];
