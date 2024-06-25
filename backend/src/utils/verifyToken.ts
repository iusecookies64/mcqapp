import client from "../models";
import JWT, { JwtPayload } from "jsonwebtoken";
import CustomError from "./CustomError";

const jwtSecret = process.env.SECRET || "123456";

export interface CustomPayload extends JwtPayload {
  username: string;
  user_id: Number;
}

export const VerifyToken = async (token: string): Promise<CustomPayload> => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        throw new CustomError("Unauthorized Request", 401);
      } else {
        resolve(decoded as CustomPayload);
      }
    });
  });
};
