import ThreadCard from "@/components/card/ThreadCard";
import { fetchThread } from "@/lib/action/thread.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  const results = await fetchThread(1, 20);

  const user = await currentUser();

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {results.threads.length === 0 ? (
          <p className="no-result">No thread found</p>
        ) : (
          <>
            {results.threads.map((thread) => {
              return (
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
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}
