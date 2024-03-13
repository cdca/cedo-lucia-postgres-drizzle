import * as z from "zod";

export const RegisterSchema = z.object({
  user: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Enter valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().min(3).max(31),
  password: z.string().min(6).max(255),
});
