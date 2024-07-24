import client from "../db/postgres";
import JWT, { JwtPayload } from "jsonwebtoken";
import CustomError from "./CustomError";

const jwtSecret = process.env.SECRET || "123456";

export interface CustomJwtPayload extends JwtPayload {
  username: string;
  user_id: number;
}

export const VerifyToken = async (token: string): Promise<CustomJwtPayload> => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(new CustomError("INVALID_TOKEN", 401));
      } else {
        resolve(decoded as CustomJwtPayload);
      }
    });
  });
};
