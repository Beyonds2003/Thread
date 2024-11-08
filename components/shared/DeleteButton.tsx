"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { deleteThread } from "@/lib/action/thread.action";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type PropType = {
  threadId: string;
  authorId: string;
  communityId: string | undefined;
  currentUserId: string | null;
  parentId: string | null;
  isComment: boolean;
  setDeleted: (deleted: boolean) => void;
  setDeletePending: (deleted: boolean) => void;
};

const DeleteButton = ({
  threadId,
  authorId,
  communityId,
  currentUserId,
  parentId,
  isComment,
  setDeleted,
  setDeletePending,
}: PropType) => {
  const [del, setDel] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId) return null;

  const handleDeleteThread = async () => {
    try {
      setDeletePending(true);
      await deleteThread(JSON.parse(threadId), pathname, parentId);
      if (!parentId || !isComment) {
        router.push("/");
      }
      await queryClient.invalidateQueries({ queryKey: ["threads"] });
      setDeletePending(false);
      setDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-end">
      <a title="Delete">
        <Image
          onClick={() => setDel((prev) => !prev)}
          src="/assets/delete_icon.png"
          alt="menu"
          width={23}
          height={23}
          className="cursor-pointer object-contain"
        />
      </a>
      {del && (
        <div
          onClick={() => setDel(false)}
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] scroll-block z-30 flex items-center justify-center"
        >
          <div className="text-white bg-dark-2 rounded-lg p-8">
            <div className="flex justify-between items-start gap-10">
              <h3 className="">
                Are you sure you want to delete <br /> this thread?{" "}
              </h3>
              <Image
                onClick={() => setDel((prev) => !prev)}
                src="/assets/delete_icon.png"
                alt="menu"
                width={23}
                height={23}
                className="cursor-pointer object-contain"
              />
            </div>
            <Button
              onClick={handleDeleteThread}
              className="bg-primary-500 mt-7"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteButton;
