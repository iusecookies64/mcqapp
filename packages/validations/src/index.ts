import { z } from "zod";

// ------------------------------------------------------------------------------------
// api validations
// ------------------------------------------------------------------------------------

export const SignupInput = z.object({
  username: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirm_password: z.string().min(6),
});

export type SignupBody = z.infer<typeof SignupInput>;

export const SigninInput = SignupInput.pick({
  username: true,
  password: true,
});

export type SigninBody = z.infer<typeof SigninInput>;

export const CreateQuestionInput = z.object({
  topic_id: z.number().min(1),
  statement: z.string().min(1),
  answer: z.number().min(1).max(4),
  option1: z.string().min(1),
  option2: z.string().min(1),
  option3: z.string().min(1),
  option4: z.string().min(1),
  difficulty: z.number().min(1).max(4),
  time_limit: z.number().min(10).max(120),
});

export const GetMatchingUsersInput = z.object({
  searchString: z.string().min(1),
});

export type GetMatchingUsersBody = z.infer<typeof GetMatchingUsersInput>;

export type CreateQuestionBody = z.infer<typeof CreateQuestionInput>;

export const UpdateQuestionInput = z.object({
  question_id: z.number().min(1),
  topic_id: z.number().min(1),
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

export const CreateTopicInput = z.object({
  title: z.string().min(1),
});

export type CreateTopicBody = z.infer<typeof CreateTopicInput>;

export const UpdateTopicInput = z.object({
  topic_id: z.number().min(1),
  new_title: z.string().min(1),
});

export type UpdateTopicBody = z.infer<typeof UpdateTopicInput>;

export const DeleteTopicInput = z.object({
  topic_id: z.number().min(1),
});

export type DeleteTopicBody = z.infer<typeof DeleteTopicInput>;

// ------------------------------------------------------------------------------------
// websocket input validations
// ------------------------------------------------------------------------------------

export const InitGameInput = z.object({
  topic_id: z.number().min(1),
  is_random: z.boolean(),
});

export type InitGameBody = z.infer<typeof InitGameInput>;

export const InitCustomGameInput = z.object({
  topic_id: z.number().min(1),
  questions: z
    .array(
      z.object({
        question_id: z.number().min(1),
        created_by: z.number().min(1),
        topic_id: z.number().min(1),
        statement: z.string().min(1),
        answer: z.number().min(1).max(4),
        option1: z.string().min(1),
        option2: z.string().min(1),
        option3: z.string().min(1),
        option4: z.string().min(1),
        difficulty: z.number().min(1).max(4),
        time_limit: z.number().min(10).max(120),
      })
    )
    .min(5),
});

export type InitCustomGameBody = z.infer<typeof InitCustomGameInput>;

export const JoinGameInput = z.object({
  game_id: z.string().min(1),
});

export type JoinGameBody = z.infer<typeof JoinGameInput>;

export const StartGameInput = JoinGameInput;

export type StartGameBody = z.infer<typeof StartGameInput>;

export const LeaveGameInput = JoinGameInput;

export type LeaveGameBody = JoinGameBody;

export const NextQuestionInput = JoinGameInput;

export type NextQuestionBody = JoinGameBody;

export const SubmitResponseInput = z.object({
  game_id: z.string().min(1),
  question_id: z.number().min(1),
  response: z.number().min(1),
});

export type SubmitResponseBody = z.infer<typeof SubmitResponseInput>;

export const SendInvitationInput = z.object({
  game_id: z.string().min(1),
  user_ids: z.array(z.number().min(1)),
});

export type SendInvitationBody = z.infer<typeof SendInvitationInput>;
