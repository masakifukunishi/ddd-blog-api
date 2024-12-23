import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { UserApplicationService } from "../../application/services/UserApplicationService";
import { CreateUserCommand } from "../../application/commands/CreateUserCommand";

export class UserController {
  constructor(private readonly userApplicationService: UserApplicationService) {}

  static validations = {
    createUser: [body("name").notEmpty().withMessage("Name is required"), body("email").isEmail().withMessage("Valid email is required")],
  };

  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const command = new CreateUserCommand(req.body.name, req.body.email);

      const user = await this.userApplicationService.createUser(command);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === "Email address is already in use") {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userApplicationService.getUser(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      await this.userApplicationService.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
