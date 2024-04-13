import ThreadList from "@/components/shared/ThreadList";
import { fetchUser } from "@/lib/action/user.action";
import { currentUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function Home() {

  const userInfo = await currentUser()
  if(!userInfo) return null;

  const  user = await fetchUser({userId: userInfo?.id})

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <ThreadList currentUserId={user?._id} />
    </div>
  );
}
