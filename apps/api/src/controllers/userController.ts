import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { UserTable } from "../types/models";
import { CustomJwtPayload, VerifyToken } from "../utils/verifyToken";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import client from "../db/postgres";
import CustomError from "../utils/CustomError";
import {
  SignupInput,
  SigninInput,
  GetMatchingUsersInput,
} from "@mcqapp/validations";
import {
  GetMatchingUsersResponse,
  ProtectedResponse,
  RefreshTokenReponse,
  SigninResponse,
  SignupResponse,
  StatusCodes,
} from "@mcqapp/types";
import { CustomRequest } from "../middlewares";

const saltRounds = parseInt(process.env.SALT || "0") || 10;
const jwtSecret = process.env.SECRET || "123456";

// function to handle signup requests
const createUserQuery = `
INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5);
`;
export const Signup = asyncErrorHandler(async (req, res) => {
  const { success, data } = SignupInput.safeParse(req.body);
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  const { password, email, username, last_name, first_name } = data;

  // converting password to hash value
  const hash = await bcrypt.hash(password, saltRounds);

  const result = await client.query(createUserQuery, [
    username,
    first_name,
    last_name,
    email,
    hash,
  ]);

  const response: SignupResponse = {
    message: "Account Created Successfully",
    status: "success",
    data: null,
  };

  res.json(response);
});

// function to handle signin requests
const expiresIn = 60000;
const getUserQuery = `Select * FROM users WHERE username=$1`;
export const Signin = asyncErrorHandler(async (req, res) => {
  const { success, data } = SigninInput.safeParse(req.body);
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  const { username, password } = data;
  const queryResult = await client.query(getUserQuery, [username]);
  // if user not found
  if (queryResult.rowCount === 0)
    throw new CustomError("Username Not Found", StatusCodes.NotFound);

  const userObject = queryResult.rows[0] as UserTable;

  // if user found compare password with hashed password
  const comparisionResult = await bcrypt.compare(password, userObject.password);
  if (comparisionResult === false)
    throw new CustomError("Incorrect Password", StatusCodes.Unauthorized);

  // valid password so we return an auth token to user
  const payload: CustomJwtPayload = {
    username,
    user_id: userObject.user_id,
  };

  const access_token = JWT.sign(payload, jwtSecret, { expiresIn });

  const refresh_token = JWT.sign(payload, jwtSecret);

  const response: SigninResponse = {
    message: "Sign In Successfull",
    status: "success",
    data: {
      access_token,
      refresh_token,
      expiresIn,
      user: queryResult.rows[0],
    },
  };

  res.status(200).json(response);
});

export const Protected = asyncErrorHandler(async (req, res) => {
  // request reaches here after passing through auth middleware
  const { username, user_id } = req as CustomRequest;
  const response: ProtectedResponse = {
    message: "Valid Token",
    status: "success",
    data: {
      username,
      user_id,
    },
  };

  res.json(response);
});

export const refreshToken = asyncErrorHandler(async (req, res) => {
  const { refresh_token } = req.cookies;
  if (!refresh_token) throw new CustomError("INVALID_TOKEN", 401);

  const decoded = await VerifyToken(refresh_token);

  const payload: CustomJwtPayload = {
    user_id: decoded.user_id,
    username: decoded.username,
  };

  const access_token = JWT.sign(payload, jwtSecret, { expiresIn });

  const response: RefreshTokenReponse = {
    message: "New Access Token",
    status: "success",
    data: {
      access_token,
      username: decoded.username,
      expiresIn,
    },
  };

  res.json(response);
});

const getMatchingUsersQuery = "SELECT * FROM users WHERE username LIKE $1";
export const GetMatchingUsers = asyncErrorHandler(async (req, res) => {
  const { success, data } = GetMatchingUsersInput.safeParse(req.body);
  if (success) {
    // adding % to match all string that starts with searchString
    const result = await client.query(getMatchingUsersQuery, [
      data.searchString + "%",
    ]);
    const response: GetMatchingUsersResponse = {
      message: "All Matching Users",
      status: "success",
      data: result.rows.map((r) => ({
        username: r.username,
        user_id: r.user_id,
      })),
    };
    res.json(response);
  } else {
    res.json([]);
  }
});
