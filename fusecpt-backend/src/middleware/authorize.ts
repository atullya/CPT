import { Request, Response, NextFunction } from "express";
import { defineAbilityFor, Actions, Subjects } from "../config/abilities";
import { APIError } from "./errorHandler";

export const authorize =
  (action: Actions, subject: Subjects) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const ability = defineAbilityFor(user);

    if (ability.can(action, subject)) {
      return next();
    }

    throw new APIError("Forbidden: You do not have permission", 403);
  };
