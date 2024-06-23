import { Request, Response, NextFunction } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";
import client from "../models";

const jwtPassword = process.env.SECRET || "123456";

export interface CustomPayload extends JwtPayload {
  username: string;
  user_id: Number;
}

export interface CustomRequest extends Request {
  user_id: Number;
  username: string;
}

const queryString = `
SELECT * FROM users WHERE username=$1 AND user_id=$2
`;

export default async function authorizeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token == undefined) throw Error;
    const decoded = JWT.verify(token, jwtPassword) as CustomPayload;
    const res = await client.query(queryString, [
      decoded.username,
      decoded.user_id,
    ]);

    // if no such user exist throw errro
    if (res.rowCount == 0) throw Error;

    // adding username and user_id to req, as it might be useful later on
    (req as CustomRequest).user_id = decoded.user_id;
    (req as CustomRequest).username = decoded.username;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
}
