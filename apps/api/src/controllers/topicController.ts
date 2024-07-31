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

const createTopicQuery = `INSERT INTO topics (title) VALUES ($1) RETURNING *;`;
export const CreateTopic = asyncErrorHandler(async (req, res) => {
  const { success, data } = CreateTopicInput.safeParse(req.body);
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  const result = await client.query(createTopicQuery, [data.title]);

  const response: CreateTopicResponse = {
    message: "Topic Created Successfully",
    status: "success",
    data: result.rows[0],
  };

  res.json(response);
});

const updateTopicQuery = `UPDATE topics SET title=$1 WHERE topic_id=$2;`;
export const UpdateTopic = asyncErrorHandler(async (req, res) => {
  const { success, data } = UpdateTopicInput.safeParse(req.body);

  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  await client.query(updateTopicQuery, [data.new_title, data.topic_id]);

  const response: UpdateTopicResponse = {
    message: "Topic Updated Successfully",
    status: "success",
  };

  res.json(response);
});

const deleteTopicQuery = `DELETE FROM topics WHERE topic_id=$1;`;
export const DeleteTopic = asyncErrorHandler(async (req, res) => {
  const { success, data } = DeleteTopicInput.safeParse(req.body);

  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  await client.query(deleteTopicQuery, [data.topic_id]);

  const response: DeleteTopicResponse = {
    message: "Topic Deleted Successfully",
    status: "success",
  };

  res.json(response);
});

const getAllTopics = `SELECT * FROM topics;`;
export const GetTopics = asyncErrorHandler(async (req, res) => {
  const result = await client.query(getAllTopics);

  const response: GetTopicsResponse = {
    message: "All Topics",
    status: "success",
    data: result.rows,
  };

  res.json(response);
});
