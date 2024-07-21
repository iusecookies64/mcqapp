import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupSchemaType = z.infer<typeof SignupSchema>;
