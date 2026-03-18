import { z } from "zod";

export const UserRegisterSchema = z.object({
  email: z.email("Invalid email."),
  password: z
    .string()
    .min(6, "Password must be least 16 letters.")
    .max(20, "Password must be less than 20 letters"),
  nickname: z
    .string()
    .min(2, "Nickname must be least 2 letters.")
    .max(15, "Nickname must be less than 15 letters"),
});
