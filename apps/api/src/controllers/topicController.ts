import {
  CreateTopicInput,
  DeleteTopicInput,
  UpdateTopicInput,
} from "@mcqapp/validations";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import CustomError from "../utils/CustomError";
import client from "../db/postgres";
import {
  CreateTopicResponse,
  DeleteTopicResponse,
  GetTopicsResponse,
  StatusCodes,
  UpdateTopicResponse,
} from "@mcqapp/types";
import { CustomRequest } from "../middlewares";

const createTopicQuery = `INSERT INTO topics (title, created_by) VALUES ($1, $2) RETURNING *;`;
export const CreateTopic = asyncErrorHandler(async (req, res) => {
  const { success, data } = CreateTopicInput.safeParse(req.body);
  const { user_id } = req as CustomRequest;
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  const result = await client.query(createTopicQuery, [data.title, user_id]);

  const response: CreateTopicResponse = {
    message: "Topic Created Successfully",
    status: "success",
    data: result.rows[0],
  };

  res.json(response);
});

const updateTopicQuery = `UPDATE topics SET title=$1 WHERE topic_id=$2 AND created_by=$3;`;
export const UpdateTopic = asyncErrorHandler(async (req, res) => {
  const { success, data } = UpdateTopicInput.safeParse(req.body);
  const { user_id } = req as CustomRequest;
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  await client.query(updateTopicQuery, [
    data.new_title,
    data.topic_id,
    user_id,
  ]);

  const response: UpdateTopicResponse = {
    message: "Topic Updated Successfully",
    status: "success",
  };

  res.json(response);
});

const deleteTopicQuery = `DELETE FROM topics WHERE topic_id=$1 AND created_by=$2;`;
export const DeleteTopic = asyncErrorHandler(async (req, res) => {
  const { success, data } = DeleteTopicInput.safeParse(req.body);
  const { user_id } = req as CustomRequest;
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  await client.query(deleteTopicQuery, [data.topic_id, user_id]);

  const response: DeleteTopicResponse = {
    message: "Topic Deleted Successfully",
    status: "success",
  };

  res.json(response);
});

const getAllTopics = `SELECT * FROM topics WHERE created_by = ANY($1);`;
export const GetTopics = asyncErrorHandler(async (req, res) => {
  const { user_id } = req as CustomRequest;
  const result = await client.query(getAllTopics, [[1, user_id]]);

  const response: GetTopicsResponse = {
    message: "All Topics",
    status: "success",
    data: result.rows,
  };

  res.json(response);
});
