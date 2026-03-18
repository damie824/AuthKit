import { string, z } from "zod";

export const UserLoginSchema = z.object({
  email: z.email("Invalid email."),
  device: string(),
  password: z
    .string()
    .min(6, "Password must be least 16 letters.")
    .max(20, "Password must be less than 20 letters"),
});
