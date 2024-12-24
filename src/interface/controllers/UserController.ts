import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { UserApplicationService } from "../../application/services/UserApplicationService";
import { CreateUserCommand } from "../../application/commands/CreateUserCommand";
import { ValidationError } from "../../application/errors/ValidationError";

export class UserController {
  constructor(private readonly userApplicationService: UserApplicationService) {}

  static validations = {
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

  async create(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const command = new CreateUserCommand(req.body.name.trim(), req.body.email.toLowerCase());

    const user = await this.userApplicationService.createUser(command);
    res.status(201).json(user);
  }

  async get(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);
    const user = await this.userApplicationService.getUser(userId);
    res.json(user);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);
    await this.userApplicationService.deleteUser(userId);
    res.status(204).send();
  }
}
