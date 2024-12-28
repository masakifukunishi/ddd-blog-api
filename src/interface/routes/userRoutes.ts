import { Router, Request, Response, NextFunction } from "express";
import type { UserController } from "../controllers/UserController.js";
import { userValidation } from "../middlewares/validations/userValidation.js";
import { validateRequest } from "../middlewares/validateRequest.js";

export const userRouter = (userController: UserController): Router => {
  const router = Router();

  router.post("/", userValidation.createUser, validateRequest, (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res).catch(next),
  );
  router.get("/:id", (req: Request, res: Response, next: NextFunction) => userController.get(req, res).catch(next));
  router.delete("/:id", (req: Request, res: Response, next: NextFunction) => userController.delete(req, res).catch(next));

  return router;
};
