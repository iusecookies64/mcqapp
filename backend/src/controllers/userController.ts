import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { UserTable } from "../types/models";
import { CustomPayload, VerifyToken } from "../utils/verifyToken";
import JWT from "jsonwebtoken";
import zod from "zod";
import bcrypt from "bcrypt";
import client from "../models";
import CustomError from "../utils/CustomError";

const saltRounds = process.env.SALT || 10;
const jwtSecret = process.env.SECRET || "123456";

const UsernameCheck = zod.string().min(1).max(50);
const EmailCheck = zod.string().max(50).email();
const PasswordCheck = zod.string().min(6).max(50);
const createUserQuery = `
INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id;
`;
// function to handle signup requests
export const Signup = asyncErrorHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // validating input
  UsernameCheck.parse(username);
  EmailCheck.parse(email);
  PasswordCheck.parse(password);

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
    throw new CustomError("Username Not Found", 401);

  const userObject = queryResult.rows[0] as UserTable;

  // if user found compare password with hashed password
  const comparisionResult = await bcrypt.compare(password, userObject.password);
  if (comparisionResult === false)
    throw new CustomError("Incorrect Password", 401);

  // valid password so we return an auth token to user
  const token = JWT.sign({ username, user_id: userObject.user_id }, jwtSecret);
  res.status(200).json({
    message: "Sign In Successfull",
    status: "success",
    token: `Bearer ${token}`,
  });
});

// function to validate a token for users that are already signed in
export const ValidateToken = asyncErrorHandler(async (req, res) => {
  const token = (req.body.token as string).replace("Bearer ", "");
  // verifying jwt token
  const decoded = await VerifyToken(token);
  // checking if that user exist in db
  const queryResult = await client.query(getUserQuery, [decoded.username]);
  // if no such user exit then token invalid
  if (queryResult.rowCount === 0)
    throw new CustomError("Invalid Token, Please Signin Again", 401);

  // user exist so sending user_id and username to client
  res.status(200).json({
    message: "Sign In Successfull",
    status: "success",
    user_id: queryResult.rows[0].user_id,
    username: queryResult.rows[0].username,
  });
});
