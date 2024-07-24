import { Request, Response, NextFunction } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";
import client from "../db/postgres";
import CustomError from "../utils/CustomError";
import { VerifyToken } from "../utils/verifyToken";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

const jwtPassword = process.env.SECRET || "123456";

export interface CustomRequest extends Request {
  user_id: number;
  username: string;
}

const queryString = `
SELECT * FROM users WHERE username=$1 AND user_id=$2
`;

const authorizeUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw new CustomError("INVALID_TOKEN", 401);
    // token exist so we check if it valid
    const payload = await VerifyToken(token);

    // adding username and user_id to req, as it might be useful later on
    (req as CustomRequest).user_id = payload.user_id;
    (req as CustomRequest).username = payload.username;
    next();
  }
);

export default authorizeUser;
