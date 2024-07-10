import { Request, Response, NextFunction } from "express";
import client from "../models";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { CustomRequest } from ".";

// middleware to verify if request for CRUD operations on questions for a contest is valid
export const isUserCreatedContest = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { contest_id } = req.query;
    const { user_id } = req as CustomRequest;
    const checkContestAndUser = `SELECT 1 FROM contests WHERE contest_id=$1 AND created_by=$2`;
    if (
      (await client.query(checkContestAndUser, [contest_id, user_id])).rowCount
    ) {
      next();
    } else {
      res.status(403).json({
        message: "Unauthorized Request",
        status: "fail",
      });
    }
  }
);
