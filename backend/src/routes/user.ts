import { Router } from "express";
import zod from "zod";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import client from "../models";
import { UserTable } from "../types/models";
import { SigninRequest, SignupRequest } from "../types/requests";
import { CustomPayload } from "../middlewares";

const jwtSecret = process.env.JWT_SECRET || "123456";
const saltRounds = process.env.SALT || 10;
const router = Router();

const createUserQuery = `
  INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id;
`;

const UsernameCheck = zod.string().min(1).max(50);
const EmailCheck = zod.string().max(50).email();
const PasswordCheck = zod.string().min(6).max(50);

router.post("/signup", async (req: SignupRequest, res) => {
  try {
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
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid Input",
      success: false,
    });
  }
});

const getUserQuery = `Select * FROM users WHERE username=$1`;

router.post("/signin", async (req: SigninRequest, res) => {
  try {
    const { username, password } = req.body;
    const queryResult = await client.query(getUserQuery, [username]);
    // if user not found
    if (queryResult.rowCount === 0) throw Error;

    const userObject = queryResult.rows[0] as UserTable;

    // if user found compare password with hashed password
    const comparisionResult = await bcrypt.compare(
      password,
      userObject.password
    );
    if (comparisionResult === false) throw Error;
    // valid password so we return an auth token to user
    const token = JWT.sign(
      { username, user_id: userObject.user_id },
      jwtSecret
    );
    res.status(200).json({
      message: "Sign In Successfull",
      success: true,
      token: `Bearer ${token}`,
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid Username Or Password",
      success: false,
    });
  }
});

router.post("/validateToken", async (req, res) => {
  try {
    const token = (req.body.token as string).replace("Bearer ", "");
    // verifying jwt token
    const decoded = JWT.verify(token, jwtSecret) as CustomPayload;
    // checking if that user exist or not
    const queryResult = await client.query(getUserQuery, [decoded.username]);
    // if no such user exit then token invalid
    if (queryResult.rowCount === 0) throw Error;
    // user exist so sending user_id and username to frontend
    res.status(200).json({
      message: "Sign In Successfull",
      success: true,
      user_id: queryResult.rows[0].user_id,
      username: queryResult.rows[0].username,
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid Auth Token",
      success: false,
    });
  }
});

export default router;
