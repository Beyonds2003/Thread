import ThreadCard from "@/components/card/ThreadCard";
import Comment from "@/components/form/Comment";
import { fetchThreadById } from "@/lib/action/thread.action";
import { fetchUser } from "@/lib/action/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

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
        key={thread.id}
        id={thread.id}
        currentUserId={user?.id || ""}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
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
        {thread.children.map((comment: any) => {
          return (
            <ThreadCard
              key={comment.id}
              id={comment.id}
              currentUserId={user?.id || ""}
              parentId={comment.parentId}
              content={comment.text}
              author={comment.author}
              community={comment.community}
              createdAt={comment.createdAt}
              comments={comment.children}
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
