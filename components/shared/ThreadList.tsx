"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { InView } from "react-intersection-observer";
import { pageType, threadType } from "@/lib/types/Types";
import ThreadCard from "../card/ThreadCard";

const fetchThreads = async (pageNumber: number) => {
  const res = await fetch("/api/threads", {
    method: "POST",
    body: JSON.stringify({ pageNumber: pageNumber, pageSize: 3 }),
  });
  const data = res.json();
  return data;
};

const ThreadList = ({ currentUserId }: { currentUserId: string | null }) => {
  // Fetching threads
  const {
    data: results,
    isLoading,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["threads"],
    queryFn: ({ pageParam }: { pageParam: number }) => fetchThreads(pageParam),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, pages) =>
      _lastPage.isNext ? pages.length + 1 : undefined,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {!results?.pages ? (
        <p className="no-result">No thread found</p>
      ) : (
        <>
          {results.pages.map((data: pageType, i: number) => {
            return (
              <div key={i} className="flex flex-col gap-10">
                {data.threads.map((thread: threadType) => {
                  return (
                    <>
                      <ThreadCard
                        key={thread._id}
                        id={thread._id}
                        currentUserId={currentUserId}
                        parentId={thread.parentId}
                        content={thread.text}
                        author={thread.author}
                        community={thread.community}
                        createdAt={thread.createdAt}
                        comments={thread.children}
                        contentImage={thread.image || ""}
                      />
                    </>
                  );
                })}
              </div>
            );
          })}

          <InView
            as="div"
            onChange={(inView) => {
              if (inView && hasNextPage) {
                fetchNextPage();
              }
            }}
          >
            {isFetchingNextPage && (
              <p className="text-white text-body-medium text-center">
                Loading...
              </p>
            )}
          </InView>
        </>
      )}
    </section>
  );
};

export default ThreadList;
