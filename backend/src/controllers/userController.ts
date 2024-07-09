import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { UserTable } from "../types/models";
import { CustomPayload, VerifyToken } from "../utils/verifyToken";
import JWT from "jsonwebtoken";
import zod from "zod";
import bcrypt from "bcrypt";
import client from "../models";
import CustomError from "../utils/CustomError";
import { CustomRequest } from "../middlewares";

const saltRounds = parseInt(process.env.SALT || "0") || 10;
const jwtSecret = process.env.SECRET || "123456";

const UsernameCheck = zod.string().min(1).max(50);
const EmailCheck = zod.string().max(50).email();
const PasswordCheck = zod.string().min(6).max(50);
const createUserQuery = `
INSERT INTO users (username, email, password) VALUES ($1, $2, $3);
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
  const token = JWT.sign({ username, user_id: userObject.user_id }, jwtSecret, {
    expiresIn: 24 * 60 * 60,
  });
  res.status(200).json({
    message: "Sign In Successfull",
    status: "success",
    token: token,
    expiresIn: 24,
  });
});

export const verifyToken = asyncErrorHandler(async (req, res) => {
  const { token } = req.body;
  const decoded = JWT.verify(token, jwtSecret);
  res.status(200).json({
    message: "Valid Token",
    status: "success",
    data: decoded,
  });
});
