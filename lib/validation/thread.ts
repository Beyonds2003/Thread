import * as z from "zod";

export const threadValidation = z.object({
  thread: z.string().nonempty().min(3, {
    message: "Minimum 3 characters need!",
  }),
  accountId: z.string(),
});

export const commentValidation = z.object({
  thread: z.string().nonempty().min(3, {
    message: "Minimum 3 characters need!",
  }),
});

export const createThreadValidation = z.object({
  thread: z.string().nonempty().min(3, {
    message: "Minimum 3 characters need!",
  }),
  accountId: z.string(),
  post_image: z.any().optional(),
});
