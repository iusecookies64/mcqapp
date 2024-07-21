import { z } from "zod";

export const SignupInput = z.object({
  username: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export type SignupInput = z.infer<typeof SignupInput>;

export const SigninInput = SignupInput.pick({
  username: true,
  password: true,
});

export type SigninInput = z.infer<typeof SigninInput>;
