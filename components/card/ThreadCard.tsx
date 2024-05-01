"use client";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DeleteButton from "../shared/DeleteButton";
import LoadingSpinner from "../shared/LoadingSpinner";
// import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  id: string;
  currentUserId: string | null;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
    _id: string;
  };
  community: {
    name: string;
    image: string;
    id: string;
    _id: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  contentImage: string;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments = [],
  isComment = false,
  contentImage,
}: Props) => {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  const [deletePending, setDeletePending] = React.useState<boolean>(false);
  const [isImageModalOpen, setImageModalOpen] = React.useState<boolean>(false);

  const toggleImageModal = () => setImageModalOpen(!isImageModalOpen);
  return (
    <>
      {!deleted && (
        <article
          className={`w-full flex flex-col rounded-xl  ${
            isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-full flex flex-rcow flex-1 gap-4">
              <div className="flex flex-col items-center">
                <Link
                  href={`/profile/${author.id}`}
                  className="relative h-11 w-11"
                >
                  <Image
                    src={author.image}
                    alt="profile image"
                    fill
                    className="cursor-pointer rounded-full"
                    onClick={toggleImageModal}
                  />
                </Link>
                                {/* Modal for image
                                {isImageModalOpen && (
                  <Dialog>
                    <DialogContent>
                    <Image
                      src={author.image}
                      alt="Expanded profile image"
                      layout="fill"
                      objectFit="contain"
                    />
                    </DialogContent>
                  </Dialog>
                )} */}

                <div className="thread-card_bar"></div>
              </div>

              <div>
                <Link href={`/profile/${author.id}`}>
                  <h4 className="cursor-pointer text-base-semibold text-light-1">
                    {author.name}
                  </h4>
                </Link>

                <p className="mt-2 text-small-regular text-light-2 w-full text-break overflow-hidden ">
                  {content}
                </p>

                {contentImage !== "" && (
                  <Image
                    src={contentImage}
                    alt="content image"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="mt-5 object-contain rounded-xl border-gray-800 border-[0.1px] w-auto  h-auto min-w-[250px] min-h-[150px] max-h-[489px]"
                  />
                )}

                <div
                  className={`mt-5 flex flex-col gap-3 ${isComment && "mb-10"}`}
                >
                  <div className="flex gap-3.5">
                    <Image
                      src={`/assets/heart-gray.svg`}
                      alt="heart"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                    <Link href={`/thread/${id}`}>
                      <Image
                        src="/assets/reply.svg"
                        alt="reply"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain"
                      />
                    </Link>
                    <Image
                      src="/assets/repost.svg"
                      alt="repost"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                    <Image
                      src="/assets/share.svg"
                      alt="share"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </div>

                  {isComment && comments.length > 0 && (
                    <Link
                      href={`/thread/${id}`}
                      className="mt-1 text-subtle-medium text-gray-1"
                    >
                      <p>{`${comments.length} ${
                        comments.length > 1 ? "Replies" : "Reply"
                      }`}</p>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {currentUserId === author._id && !deletePending && (
              <DeleteButton
                setDeleted={setDeleted}
                setDeletePending={setDeletePending}
                threadId={JSON.stringify(id)}
                currentUserId={currentUserId}
                authorId={author.id}
                parentId={parentId}
                isComment={isComment}
                communityId={community ? community.id : undefined}
              />
            )}
            {(id === undefined || deletePending) && (
              <LoadingSpinner width={28} height={28} color="white" />
            )}
          </div>

          {!isComment && comments.length > 0 && (
            <div className="ml-1 mt-3 flex items-center gap-2">
              {comments.slice(0, 2).map((comment, index) => (
                <Image
                  key={index}
                  src={comment.author.image}
                  alt={`user_${index}`}
                  width={28}
                  height={28}
                  className={`${
                    index !== 0 && "-ml-5"
                  } rounded-full object-cover h-[28px]`}
                />
              ))}
              <Link href={`/thread/${id}`}>
                <p className="mt-1 text-subtle-medium text-gray-1">
                  {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                </p>
              </Link>
            </div>
          )}

          {!isComment && community && (
            <Link href={`/communities/${community.id}`} className="mt-5 flex ">
              <p className="text-subtle-medium text-gray-1">
                {formatDateString(createdAt)}
                {community && ` - ${community.name} Community`}
              </p>

              <Image
                src={community.image}
                alt={community.name}
                width={18}
                height={18}
                className="ml-1 rounded-full object-cover h-[18px]"
              />
            </Link>
          )}
        </article>
      )}
    </>
  );
};

export default ThreadCard;
