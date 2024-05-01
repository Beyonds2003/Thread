import Comment from "@/components/form/Comment";
import { fetchThreadById } from "@/lib/action/thread.action";
import { fetchUser } from "@/lib/action/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "@/components/card/ThreadCard";
import { threadType } from "@/lib/types/Types";

const ThreadDetail = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ userId: user.id });
  if (!userInfo.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <ThreadCard
        id={thread._id}
        currentUserId={user?.id ?? null}
        parentId={thread.parentId}
        content={thread.text}
        author={{
          name: thread.author.name,
          image: thread.author.image,
          id: thread.author.id,
          _id: `${thread.author._id}`,
        }}
        community={
          thread.community
            ? {
                id: `${thread.community._id}`,
                name: thread.community.name,
                image: thread.community.image,
                _id: `${thread.community._id}`,
              }
            : null
        }
        createdAt={thread.createdAt}
        comments={thread.children.map((child: any) => ({
          author: { image: child.author.image },
        }))}
        contentImage={thread.image || ""}
      />

      <div className="mt-7">
        <Comment
          threadId={params.id}
          userImage={userInfo.image}
          userId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((comment: threadType) => {
          return (
            <ThreadCard
              key={`${comment._id}`}
              id={`${comment._id}`}
              currentUserId={user?.id ?? null}
              parentId={comment.parentId}
              content={comment.text}
              author={{
                name: comment.author.name,
                image: comment.author.image,
                id: comment.author.id,
                _id: `${comment.author._id}`,
              }}
              community={
                thread.community
                  ? {
                      id: `${thread.community._id}`,
                      name: thread.community.name,
                      image: thread.community.image,
                      _id: `${thread.community._id}`,
                    }
                  : null
              }
              createdAt={comment.createdAt}
              comments={comment.children.map((child: any) => ({
                author: { image: child.author.image },
              }))}
              isComment={true}
              contentImage={comment.image || ""}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ThreadDetail;
