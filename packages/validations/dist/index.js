"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendInvitationInput = exports.SubmitResponseInput = exports.NextQuestionInput = exports.LeaveGameInput = exports.StartGameInput = exports.JoinGameInput = exports.InitCustomGameInput = exports.InitGameInput = exports.DeleteTopicInput = exports.UpdateTopicInput = exports.CreateTopicInput = exports.DeleteQuestionInput = exports.UpdateQuestionInput = exports.GetMatchingUsersInput = exports.CreateQuestionInput = exports.SigninInput = exports.SignupInput = void 0;
const zod_1 = require("zod");
// ------------------------------------------------------------------------------------
// api validations
// ------------------------------------------------------------------------------------
exports.SignupInput = zod_1.z.object({
    username: zod_1.z.string().min(1),
    first_name: zod_1.z.string().min(1),
    last_name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    confirm_password: zod_1.z.string().min(6),
});
exports.SigninInput = exports.SignupInput.pick({
    username: true,
    password: true,
});
exports.CreateQuestionInput = zod_1.z.object({
    topic_id: zod_1.z.number().min(1),
    statement: zod_1.z.string().min(1),
    answer: zod_1.z.number().min(1).max(4),
    option1: zod_1.z.string().min(1),
    option2: zod_1.z.string().min(1),
    option3: zod_1.z.string().min(1),
    option4: zod_1.z.string().min(1),
    difficulty: zod_1.z.number().min(1).max(4),
    time_limit: zod_1.z.number().min(10).max(120),
});
exports.GetMatchingUsersInput = zod_1.z.object({
    searchString: zod_1.z.string().min(1),
});
exports.UpdateQuestionInput = zod_1.z.object({
    question_id: zod_1.z.number().min(1),
    topic_id: zod_1.z.number().min(1),
    statement: zod_1.z.string().min(1),
    answer: zod_1.z.number().min(1).max(4),
    option1: zod_1.z.string().min(1),
    option2: zod_1.z.string().min(1),
    option3: zod_1.z.string().min(1),
    option4: zod_1.z.string().min(1),
    difficulty: zod_1.z.number().min(1).max(4),
    time_limit: zod_1.z.number().min(10).max(120),
});
exports.DeleteQuestionInput = zod_1.z.object({
    question_id: zod_1.z.number().min(1),
});
exports.CreateTopicInput = zod_1.z.object({
    title: zod_1.z.string().min(1),
});
exports.UpdateTopicInput = zod_1.z.object({
    topic_id: zod_1.z.number().min(1),
    new_title: zod_1.z.string().min(1),
});
exports.DeleteTopicInput = zod_1.z.object({
    topic_id: zod_1.z.number().min(1),
});
// ------------------------------------------------------------------------------------
// websocket input validations
// ------------------------------------------------------------------------------------
exports.InitGameInput = zod_1.z.object({
    topic_id: zod_1.z.number().min(1),
    is_random: zod_1.z.boolean(),
});
exports.InitCustomGameInput = zod_1.z.object({
    topic_id: zod_1.z.number().min(1),
    questions: zod_1.z
        .array(zod_1.z.object({
        question_id: zod_1.z.number().min(1),
        created_by: zod_1.z.number().min(1),
        topic_id: zod_1.z.number().min(1),
        statement: zod_1.z.string().min(1),
        answer: zod_1.z.number().min(1).max(4),
        option1: zod_1.z.string().min(1),
        option2: zod_1.z.string().min(1),
        option3: zod_1.z.string().min(1),
        option4: zod_1.z.string().min(1),
        difficulty: zod_1.z.number().min(1).max(4),
        time_limit: zod_1.z.number().min(10).max(120),
    }))
        .min(5),
});
exports.JoinGameInput = zod_1.z.object({
    game_id: zod_1.z.string().min(1),
});
exports.StartGameInput = exports.JoinGameInput;
exports.LeaveGameInput = exports.JoinGameInput;
exports.NextQuestionInput = exports.JoinGameInput;
exports.SubmitResponseInput = zod_1.z.object({
    game_id: zod_1.z.string().min(1),
    question_id: zod_1.z.number().min(1),
    response: zod_1.z.number().min(1),
});
exports.SendInvitationInput = zod_1.z.object({
    game_id: zod_1.z.string().min(1),
    user_ids: zod_1.z.array(zod_1.z.number().min(1)),
});
