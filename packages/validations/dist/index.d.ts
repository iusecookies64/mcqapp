import { z } from "zod";
export declare const SignupInput: z.ZodObject<{
    username: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirm_password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}, {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}>;
export type SignupBody = z.infer<typeof SignupInput>;
export declare const SigninInput: z.ZodObject<Pick<{
    username: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirm_password: z.ZodString;
}, "username" | "password">, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type SigninBody = z.infer<typeof SigninInput>;
export declare const CreateQuestionInput: z.ZodObject<{
    topic_id: z.ZodNumber;
    statement: z.ZodString;
    answer: z.ZodNumber;
    option1: z.ZodString;
    option2: z.ZodString;
    option3: z.ZodString;
    option4: z.ZodString;
    difficulty: z.ZodNumber;
    time_limit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    topic_id: number;
    statement: string;
    answer: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    difficulty: number;
    time_limit: number;
}, {
    topic_id: number;
    statement: string;
    answer: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    difficulty: number;
    time_limit: number;
}>;
export declare const GetMatchingUsersInput: z.ZodObject<{
    searchString: z.ZodString;
}, "strip", z.ZodTypeAny, {
    searchString: string;
}, {
    searchString: string;
}>;
export type GetMatchingUsersBody = z.infer<typeof GetMatchingUsersInput>;
export type CreateQuestionBody = z.infer<typeof CreateQuestionInput>;
export declare const UpdateQuestionInput: z.ZodObject<{
    question_id: z.ZodNumber;
    topic_id: z.ZodNumber;
    statement: z.ZodString;
    answer: z.ZodNumber;
    option1: z.ZodString;
    option2: z.ZodString;
    option3: z.ZodString;
    option4: z.ZodString;
    difficulty: z.ZodNumber;
    time_limit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    topic_id: number;
    statement: string;
    answer: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    difficulty: number;
    time_limit: number;
    question_id: number;
}, {
    topic_id: number;
    statement: string;
    answer: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    difficulty: number;
    time_limit: number;
    question_id: number;
}>;
export type UpdateQuestionBody = z.infer<typeof UpdateQuestionInput>;
export declare const DeleteQuestionInput: z.ZodObject<{
    question_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    question_id: number;
}, {
    question_id: number;
}>;
export type DeleteQuestionBody = z.infer<typeof DeleteQuestionInput>;
export declare const CreateTopicInput: z.ZodObject<{
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
}, {
    title: string;
}>;
export type CreateTopicBody = z.infer<typeof CreateTopicInput>;
export declare const UpdateTopicInput: z.ZodObject<{
    topic_id: z.ZodNumber;
    new_title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    topic_id: number;
    new_title: string;
}, {
    topic_id: number;
    new_title: string;
}>;
export type UpdateTopicBody = z.infer<typeof UpdateTopicInput>;
export declare const DeleteTopicInput: z.ZodObject<{
    topic_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    topic_id: number;
}, {
    topic_id: number;
}>;
export type DeleteTopicBody = z.infer<typeof DeleteTopicInput>;
export declare const InitGameInput: z.ZodObject<{
    topic_id: z.ZodNumber;
    is_random: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    topic_id: number;
    is_random: boolean;
}, {
    topic_id: number;
    is_random: boolean;
}>;
export type InitGameBody = z.infer<typeof InitGameInput>;
export declare const InitCustomGameInput: z.ZodObject<{
    topic_id: z.ZodNumber;
    questions: z.ZodArray<z.ZodObject<{
        question_id: z.ZodNumber;
        created_by: z.ZodNumber;
        topic_id: z.ZodNumber;
        statement: z.ZodString;
        answer: z.ZodNumber;
        option1: z.ZodString;
        option2: z.ZodString;
        option3: z.ZodString;
        option4: z.ZodString;
        difficulty: z.ZodNumber;
        time_limit: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        topic_id: number;
        statement: string;
        answer: number;
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        difficulty: number;
        time_limit: number;
        question_id: number;
        created_by: number;
    }, {
        topic_id: number;
        statement: string;
        answer: number;
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        difficulty: number;
        time_limit: number;
        question_id: number;
        created_by: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    topic_id: number;
    questions: {
        topic_id: number;
        statement: string;
        answer: number;
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        difficulty: number;
        time_limit: number;
        question_id: number;
        created_by: number;
    }[];
}, {
    topic_id: number;
    questions: {
        topic_id: number;
        statement: string;
        answer: number;
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        difficulty: number;
        time_limit: number;
        question_id: number;
        created_by: number;
    }[];
}>;
export type InitCustomGameBody = z.infer<typeof InitCustomGameInput>;
export declare const JoinGameInput: z.ZodObject<{
    game_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    game_id: string;
}, {
    game_id: string;
}>;
export type JoinGameBody = z.infer<typeof JoinGameInput>;
export declare const StartGameInput: z.ZodObject<{
    game_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    game_id: string;
}, {
    game_id: string;
}>;
export type StartGameBody = z.infer<typeof StartGameInput>;
export declare const LeaveGameInput: z.ZodObject<{
    game_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    game_id: string;
}, {
    game_id: string;
}>;
export type LeaveGameBody = JoinGameBody;
export declare const NextQuestionInput: z.ZodObject<{
    game_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    game_id: string;
}, {
    game_id: string;
}>;
export type NextQuestionBody = JoinGameBody;
export declare const SubmitResponseInput: z.ZodObject<{
    game_id: z.ZodString;
    question_id: z.ZodNumber;
    response: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    question_id: number;
    game_id: string;
    response: number;
}, {
    question_id: number;
    game_id: string;
    response: number;
}>;
export type SubmitResponseBody = z.infer<typeof SubmitResponseInput>;
export declare const SendInvitationInput: z.ZodObject<{
    game_id: z.ZodString;
    user_ids: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    game_id: string;
    user_ids: number[];
}, {
    game_id: string;
    user_ids: number[];
}>;
export type SendInvitationBody = z.infer<typeof SendInvitationInput>;
