import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { UserTable } from "../types/models";
import { VerifyToken } from "../utils/verifyToken";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import client from "../models";
import CustomError from "../utils/CustomError";
// import { Use } from "@mcqapp/validations";
import { SignupSchema } from "@mcqapp/validations";
import { JOINED_SUCCESSFULLY } from "@mcqapp/types";

const saltRounds = parseInt(process.env.SALT || "0") || 10;
const jwtSecret = process.env.SECRET || "123456";

const createUserQuery = `
INSERT INTO users (username, email, password) VALUES ($1, $2, $3);
`;
// function to handle signup requests
export const Signup = asyncErrorHandler(async (req, res) => {
  const { success, data } = SignupSchema.safeParse(req.body);
  if (!success) throw new CustomError("Invalid Input", 403);

  const { password, email, username } = data;

  // converting password to hash value
  const hash = await bcrypt.hash(password, saltRounds);

  const result = await client.query(createUserQuery, [username, email, hash]);

  res.status(200).json({
    message: "Account Created Successfully",
    status: "success",
  });
});

// function to handle signin requests
const getUserQuery = `Select * FROM users WHERE username=$1`;
export const Signin = asyncErrorHandler(async (req, res) => {
  const { username, password } = req.body;
  const queryResult = await client.query(getUserQuery, [username]);
  // if user not found
  if (queryResult.rowCount === 0)
    throw new CustomError("Username Not Found", 404);

  const userObject = queryResult.rows[0] as UserTable;

  // if user found compare password with hashed password
  const comparisionResult = await bcrypt.compare(password, userObject.password);
  if (comparisionResult === false)
    throw new CustomError("Incorrect Password", 403);

  // valid password so we return an auth token to user
  const access_token = JWT.sign(
    { username, user_id: userObject.user_id },
    jwtSecret,
    {
      expiresIn: 1000 * 60,
    }
  );

  const refresh_token = JWT.sign(
    { username, user_id: userObject.user_id },
    jwtSecret
  );

  res.status(200).json({
    message: "Sign In Successfull",
    status: "success",
    access_token,
    refresh_token,
    expiresIn: 28,
  });
});

export const Protected = asyncErrorHandler(async (req, res) => {
  const access_token = req.headers.authorization?.replace("Bearer ", "");
  if (!access_token) throw new CustomError("INVALID_TOKEN", 401);

  const decoded = await VerifyToken(access_token);

  res.status(200).json({
    message: "Valid Token",
    status: "success",
    data: decoded,
  });
});

export const refreshToken = asyncErrorHandler(async (req, res) => {
  const { refresh_token } = req.cookies;
  if (!refresh_token) throw new CustomError("INVALID_TOKEN", 401);

  const decoded = await VerifyToken(refresh_token);

  const access_token = JWT.sign(
    { username: decoded.username, user_id: decoded.user_id },
    jwtSecret,
    { expiresIn: 1000 * 60 }
  );

  res.status(200).json({
    message: "New Access Token",
    status: "success",
    access_token,
    expiresIn: 1000,
  });
});
