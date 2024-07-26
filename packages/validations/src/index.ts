import { z } from "zod";

export const SignupInput = z.object({
  username: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupBody = z.infer<typeof SignupInput>;

export const SigninInput = SignupInput.pick({
  username: true,
  password: true,
});

export type SigninBody = z.infer<typeof SigninInput>;

export const CreateQuestionInput = z.object({
  topics: z.array(z.string().min(1)),
  statement: z.string().min(1),
  answer: z.number().min(1).max(4),
  option1: z.string().min(1),
  option2: z.string().min(1),
  option3: z.string().min(1),
  option4: z.string().min(1),
  difficulty: z.number().min(1).max(4),
  time_limit: z.number().min(10).max(120),
});

export type CreateQuestionBody = z.infer<typeof CreateQuestionInput>;

export const UpdateQuestionInput = z.object({
  question_id: z.number().min(1),
  topics: z.array(z.string().min(1)),
  statement: z.string().min(1),
  answer: z.number().min(1).max(4),
  option1: z.string().min(1),
  option2: z.string().min(1),
  option3: z.string().min(1),
  option4: z.string().min(1),
  difficulty: z.number().min(1).max(4),
  time_limit: z.number().min(10).max(120),
});

export type UpdateQuestionBody = z.infer<typeof UpdateQuestionInput>;

export const DeleteQuestionInput = z.object({
  question_id: z.number().min(1),
});

export type DeleteQuestionBody = z.infer<typeof DeleteQuestionInput>;

export const InitGameInput = z.object({
  topic_id: z.number().min(1),
  is_random: z.boolean(),
  is_duel: z.boolean(),
});

export type InitGameBody = z.infer<typeof InitGameInput>;
