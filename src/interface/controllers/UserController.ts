import { Request, Response } from "express";
import { UserApplicationService } from "../../application/services/UserApplicationService.js";
import { CreateUserCommand } from "../../application/commands/CreateUserCommand.js";

export class UserController {
  constructor(private readonly userApplicationService: UserApplicationService) {}

  async create(req: Request, res: Response): Promise<void> {
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
