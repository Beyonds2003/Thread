import * as z from "zod";

export const userValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters for name" })
    .max(30, { message: "Maximum 30 characters for name" }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters for username" })
    .max(30, { message: "Maximum 30 characters for username" }),
  bio: z
    .string()
    .min(3, { message: "Minimum 3 characters for bio" })
    .max(100, { message: "Maximum 100 characters for bio" }),
});
