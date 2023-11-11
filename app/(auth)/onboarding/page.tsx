//app/page.tsx
import AccountProfile from "@/components/form/AccountProfile";
import { fetchUser } from "@/lib/action/user.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function OnBoarding() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo: any = await fetchUser({ userId: user.id });

  const userData = {
    id: user.id,
    objectId: userInfo?.id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="flex flex-1 min-h-screen bg-dark-1">
      <div className="px-10 py-20 w-full max-w-3xl mx-auto">
        <h1 className="head-text">Onboarding</h1>
        <p className="text-light-2 text-base-regular mt-3">
          Complete your profile now, to use Thread.
        </p>
        <section className="p-10 bg-dark-2 mt-9">
          <AccountProfile user={userData} btnTitle="Continue" />
        </section>
      </div>
    </main>
  );
}
