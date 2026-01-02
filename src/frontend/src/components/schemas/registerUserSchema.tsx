import z from "zod";

export const registerUserSchema = z.object({
  username: z
    .string()
    .min(6)
    .max(25)
    .regex(/^[A-Za-z0-9]+$/, {
      message: "Username must not contain special characters",
    }),
  email: z.email(),
  password: z
    .string()
    .min(6)
    .max(40)
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must contain at least one number",
    })
    .refine((password) => /[\W_]/.test(password), {
      message: "Password must contain at least one special character",
    }),
});

export type RegisterRequest = z.infer<typeof registerUserSchema>;
