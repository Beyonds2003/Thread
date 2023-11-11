import React from "react";
import { fetchActivity, fetchUser } from "@/lib/action/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

const Activity = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ userId: user.id });
  if (!userInfo.onboarded) redirect("/onboarding");

  const activity = await fetchActivity({ userId: userInfo._id });

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((act) => (
              <Link key={act._id} href={`/thread/${act.parentId}`}>
                <article className="activity-card">
                  <div className="w-[30px] h-[30px] relative">
                    <Image
                      src={act.author.image}
                      alt="profile image"
                      fill
                      className="rounded-full"
                    />
                  </div>
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-2 text-primary-500">
                      {act.author.name}
                    </span>
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-light-1">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Activity;
