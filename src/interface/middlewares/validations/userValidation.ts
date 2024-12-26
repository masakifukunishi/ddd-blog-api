import { body } from "express-validator";

export const userValidation = {
  createUser: [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Name must be between 1 and 100 characters"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  ],
};
