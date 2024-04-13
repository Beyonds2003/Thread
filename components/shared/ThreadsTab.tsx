import { fetchUserThreads } from "@/lib/action/user.action";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../card/ThreadCard";
import {
  fetchCommunityDetail,
  fetchCommunityPosts,
} from "@/lib/action/community.action";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
      _id: string
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
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
      {results.threads.map((thread: any) => (
        <ThreadCard
          key={thread.id}
          id={thread.id}
          currentUserId={accountId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: results.name, image: results.image, id: results.id, _id: accountId }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                  _id: accountId
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
