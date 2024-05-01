"use client";
import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { userValidation } from "@/lib/validation/user";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { resizeImage, updateUser } from "@/lib/action/user.action";
import { useRouter, usePathname } from "next/navigation";
import { type } from "os";
import { resizeProfile } from "@/lib/file_resizer";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "../shared/LoadingSpinner";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [image, setImage] = React.useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const [pending, setPending] = React.useState(false);
  const clerk_user = useUser();

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user.image,
      name: user.name,
      username: user.username,
      bio: user.bio,
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    // Check file exit or not
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setImage(Array.from(e.target.files));

      // Check file type is valid image
      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    setPending(true);

    const blob = values.profile_photo;

    let hasImageChange = isBase64Image(blob);

    if (hasImageChange) {
      // Resizing image file to 400 x 400
      const resizeImage: any = await resizeProfile(image[0]);

      // Upload image file to uploadthing database
      const imageRes = await startUpload([resizeImage]);

      if (imageRes && imageRes[0].fileUrl) {
        values.profile_photo = imageRes[0].fileUrl;

        await clerk_user.user?.setProfileImage({ file: blob });

        console.log("clerk image update");
      }
    }

    // TODO for database
    await updateUser({
      name: values.name,
      username: values.username,
      userId: user.id,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
    setPending(false);
  };

  console.log("Pending: ", pending);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4">
              <FormLabel className="account-form_image-label relative">
                {field.value ? (
                  <Image
                    src={field.value}
                    priority
                    className="rounded-full object-cover"
                    alt="profile photo"
                    fill
                  />
                ) : (
                  <Image
                    src={"/assets/profile.svg"}
                    alt="profile photo"
                    width={24}
                    height={24}
                    priority
                    className="object-contain rounded-full"
                  />
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type={"file"}
                  accept="image/*"
                  placeholder="Choose your profile"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-4">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type={"text"}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-4">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type={"text"}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-4">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <Button
          className="bg-primary-500 w-full text-base-semibold text-light-2"
          type="submit"
          disabled={pending}
        >
          {pending && <LoadingSpinner width={23} height={23} color="white" />}
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
