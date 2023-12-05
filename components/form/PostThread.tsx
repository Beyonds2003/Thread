"use client";
import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useRouter, usePathname } from "next/navigation";
import { createThreadValidation } from "@/lib/validation/thread";
import { createThread } from "@/lib/action/thread.action";
import Image from "next/image";
import { isBase64Image } from "@/lib/utils";
import { resizeThreadImage } from "@/lib/file_resizer";
import { useUploadThing } from "@/lib/uploadthing";
import { useOrganization } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import { pageType } from "@/lib/types/Types";

interface Props {
  userId: string;
  userName: string;
  userImage: string;
}

type oldResultType = { pages: pageType[]; pageParams: number[] };

const PostThread = ({ userId, userName, userImage }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const { startUpload } = useUploadThing("imageUploader");

  const { organization } = useOrganization();

  const postImageInput = React.useRef<HTMLInputElement>(null);
  const [textareaHeight, setTextareaHeight] = React.useState("auto");

  const [postImage, setPostImage] = React.useState<File[]>([]);

  const queryClient = useQueryClient();

  const handleUploadImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    let fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setPostImage(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const form = useForm({
    resolver: zodResolver(createThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      post_image: "",
    },
  });

  const backgroundWork = async (
    values: z.infer<typeof createThreadValidation>,
    organizationId: string | null,
    pathname: string
  ) => {
    try {
      const blob = values.post_image;
      const hasImageChange = isBase64Image(blob);

      let imageUrl = "";

      // Check imagefield input change or not
      if (hasImageChange) {
        // Resize image to 1200 x 600
        const resizeImage: any = await resizeThreadImage(postImage[0]);

        // Upload image to uploadthing database
        const imageRes = await startUpload([resizeImage]);

        if (imageRes && imageRes[0]?.fileUrl) {
          imageUrl = imageRes[0]?.fileUrl;
        }
      }

      const res = await fetch("http://localhost:3000/api/createThread", {
        method: "POST",
        body: JSON.stringify({
          text: values.thread,
          author: userId,
          communityId: organizationId,
          path: pathname,
          image: imageUrl,
        }),
      });
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const onSubmit = async (values: z.infer<typeof createThreadValidation>) => {
    // Optimistic update
    await queryClient.setQueryData(["threads"], (oldResult: oldResultType) => {
      return {
        pageParams: [1],
        pages: [
          {
            threads: [
              {
                _id: randomUUID,
                parentId: null,
                text: values.thread,
                author: { name: userName, image: userImage, id: userId },
                community: organization
                  ? {
                      name: organization.name,
                      image: organization.imageUrl,
                      id: organization.id,
                    }
                  : null,
                createdAt: new Date().toISOString().replace("Z", "+00:00"),
                children: [],
                image: values.post_image,
              },
              ...oldResult.pages[0].threads,
            ],
            isNext: oldResult.pages[0].isNext,
          },
        ],
      };
    });

    // Submiting form from background without blocking ui to get optimistic update
    backgroundWork(values, organization ? organization.id : null, pathname);

    router.push("/");
  };

  // Automatic adjust textarea height when uesr type
  const handleTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    let numberOfChaInWidth = textarea.clientWidth / 12;
    let addHeight = Math.floor(e.target.value.length / numberOfChaInWidth);
    setTextareaHeight("auto"); // Reset the height to auto to calculate the new height
    setTextareaHeight(`${addHeight * 30 + 64}px`);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col mt-10 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="bg-dark-3 min-h-[400px] relative pr-6">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4 relative">
                {/* <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel> */}
                <FormControl className="no-focus text-light-1 pt-4">
                  <Textarea
                    placeholder="What is happening?!"
                    style={{ fontSize: "20px", height: textareaHeight }}
                    onInput={handleTextareaHeight}
                    className="bg-dark-3 border-none resize-none pl-6"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="post_image"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-4">
                <FormLabel></FormLabel>
                <FormControl>
                  <div
                    className={`${
                      postImage.length > 0 ? "h-[80%]" : "h-[200px]"
                    }   relative`}
                  >
                    {postImage.length > 0 && (
                      <div className="w-full relative rounded-3xl">
                        <Image
                          src={field.value}
                          width={0}
                          height={0}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "600px",
                          }}
                          alt="image"
                          className="flex object-fill rounded-xl"
                          onClick={() => {
                            if (postImageInput.current !== null) {
                              postImageInput.current.click();
                            }
                          }}
                        />
                      </div>
                    )}

                    <input
                      type={"file"}
                      accept="image/*"
                      hidden
                      ref={postImageInput}
                      onChange={(e) => handleUploadImage(e, field.onChange)}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            <div className="h-[0.1px] mt-10 bg-gray-600 mr-[-1.5rem]" />
            <div className="cursor-pointer my-5 mx-5 ">
              <Image
                src="/assets/uploadImage.png"
                width={32}
                height={32}
                alt="image"
                onClick={() => {
                  if (postImageInput.current !== null) {
                    postImageInput.current.click();
                  }
                }}
              />
            </div>
          </div>
        </div>
        <Button
          className="bg-primary-500 mt-10 text-light-1 w-full"
          type="submit"
        >
          Post Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
