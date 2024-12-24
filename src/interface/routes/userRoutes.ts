import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/UserController";

export const userRouter = (userController: UserController): Router => {
  const router = Router();

  router.post("/", UserController.validations.createUser, (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res).catch(next)
  );

  router.get("/:id", (req: Request, res: Response, next: NextFunction) => userController.get(req, res).catch(next));

  router.delete("/:id", (req: Request, res: Response, next: NextFunction) => userController.delete(req, res).catch(next));

  return router;
};
