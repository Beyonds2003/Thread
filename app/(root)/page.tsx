import ThreadCard from "@/components/card/ThreadCard";
import ThreadList from "@/components/shared/ThreadList";
import { fetchThread } from "@/lib/action/thread.action";
import { currentUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <ThreadList />
    </div>
  );
}
