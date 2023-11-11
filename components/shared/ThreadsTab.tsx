import { fetchThread } from "@/lib/action/thread.action";
import { fetchUserThreads } from "@/lib/action/user.action";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../card/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  const results = await fetchUserThreads(accountId);

  if (!results) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {results.threads.map((thread: any) => (
        <ThreadCard
          key={thread.id}
          id={thread.id}
          currentUserId={accountId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: results.name, image: results.image, id: results.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          contentImage={thread.image || ""}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
