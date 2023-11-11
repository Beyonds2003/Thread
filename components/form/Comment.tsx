"use client";

import { commentValidation } from "@/lib/validation/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import Image from "next/image";
import { Button } from "../ui/button";
import { addCommentToThread } from "@/lib/action/thread.action";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
  userImage: string;
  userId: string;
}

const Comment = ({ threadId, userImage, userId }: Props) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(userId),
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-4">
              <FormLabel className="relative w-[48px] h-[44px]">
                <Image
                  src={userImage}
                  alt="profile image"
                  fill
                  className="rounded-full"
                />
              </FormLabel>
              <FormControl className="bg-transparent border-none">
                <Input
                  type={"text"}
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
