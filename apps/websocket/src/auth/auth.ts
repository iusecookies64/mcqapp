import JWT from "jsonwebtoken";

export interface userJwtClaims {
  username: string;
  user_id: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

const extractAuthUser = (token: string): userJwtClaims | null => {
  try {
    const decoded = JWT.verify(token, JWT_SECRET) as userJwtClaims;
    return decoded;
  } catch (err) {
    return null;
  }
};

export default extractAuthUser;
