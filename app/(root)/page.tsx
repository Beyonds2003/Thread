import Test from "@/components/shared/Test";
import ThreadList from "@/components/shared/ThreadList";
import { fetchUser } from "@/lib/action/user.action";
import { Author } from "@/lib/types/Types";
import { currentUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function Home() {
  let user: Author | null = null;
  let userInfo = await currentUser();

  if (userInfo) {
    user = await fetchUser({ userId: userInfo.id });
  }

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <ThreadList currentUserId={user?._id ?? null} />
    </div>
  );
}
