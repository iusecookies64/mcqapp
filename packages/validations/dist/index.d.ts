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
    topics: z.ZodArray<z.ZodString, "many">;
    statement: z.ZodString;
    answer: z.ZodNumber;
    option1: z.ZodString;
    option2: z.ZodString;
    option3: z.ZodString;
    option4: z.ZodString;
    difficulty: z.ZodNumber;
    time_limit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    topics: string[];
    statement: string;
    answer: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    difficulty: number;
    time_limit: number;
}, {
    topics: string[];
    statement: string;
    answer: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    difficulty: number;
    time_limit: number;
}>;
export type CreateQuestionBody = z.infer<typeof CreateQuestionInput>;
export declare const UpdateQuestionInput: z.ZodObject<{
    question_id: z.ZodNumber;
    topics: z.ZodArray<z.ZodString, "many">;
    statement: z.ZodString;
    answer: z.ZodNumber;
    option1: z.ZodString;
    option2: z.ZodString;
    option3: z.ZodString;
    option4: z.ZodString;
    difficulty: z.ZodNumber;
    time_limit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    topics: string[];
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
    topics: string[];
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
export declare const JoinGameInput: z.ZodObject<{
    game_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    game_id: string;
}, {
    game_id: string;
}>;
export type JoinGameBody = z.infer<typeof JoinGameInput>;
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
    topic: z.ZodString;
    user_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    game_id: string;
    topic: string;
    user_id: number;
}, {
    game_id: string;
    topic: string;
    user_id: number;
}>;
export type SendInvitationBody = z.infer<typeof SendInvitationInput>;
