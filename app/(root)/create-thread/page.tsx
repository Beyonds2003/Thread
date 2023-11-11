import PostThread from "@/components/form/PostThread";
import { fetchUser } from "@/lib/action/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const CreateThread = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser({ userId: user.id });

  if (!userInfo.onboarded) {
    redirect("/onboarding");
  }

  return (
    <section>
      <span className="head-text">Create Thread</span>
      <PostThread userId={userInfo._id} />
    </section>
  );
};

export default CreateThread;
