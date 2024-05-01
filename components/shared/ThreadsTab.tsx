import { fetchUserThreads } from "@/lib/action/user.action";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../card/ThreadCard";
import {
  fetchCommunityDetail,
  fetchCommunityPosts,
} from "@/lib/action/community.action";
import { ThreadDetail } from "@/lib/types/Types";

interface Result {
  name: string;
  image: string;
  id: string;
  _id: string;
  threads: ThreadDetail[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let results: Result;

  if (accountType === "User") {
    // Fetch User Threads
    results = await fetchUserThreads(accountId);
  } else {
    // Fetch Community Threads
    results = await fetchCommunityPosts(accountId);
  }

  if (!results) redirect("/");

    

  return (
    <section className="mt-9 flex flex-col gap-10">
      {results.threads.map((thread: ThreadDetail, index) => (
        <ThreadCard
          key={index}
          id={`${thread._id}`}
          currentUserId={accountId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  name: results.name,
                  image: results.image,
                  id: results.id,
                  _id: accountId,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                  _id: accountId,
                }
          }
          community={thread.community && {
            id: `${thread.community._id}`,
            name: thread.community.name,
            image: thread.community.image,
            _id: `${thread.community._id}`
          }}
          createdAt={thread.createdAt}
          comments={thread.children.map(item => ({author: {image: item.author.image}}))}
          contentImage={thread.image || ""}
      />
      ))}
    </section>
  );
};

export default ThreadsTab;
