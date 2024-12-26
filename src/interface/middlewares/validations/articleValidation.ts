import { body } from "express-validator";

export const articleValidation = {
  createArticle: [
    body("title").notEmpty().withMessage("Title is required").isLength({ max: 100 }).withMessage("Title must be less than 100 characters"),
    body("content").notEmpty().withMessage("Content is required"),
    body("userId").isInt().withMessage("Valid user ID is required"),
  ],
};
