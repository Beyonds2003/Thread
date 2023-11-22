import React from "react";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { currentUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { fetchCommunityDetail } from "@/lib/action/community.action";
import UserCard from "@/components/card/UserCard";

const Community = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const communityInfo = await fetchCommunityDetail(params.id);
  if (!communityInfo) return null;

  return (
    <section>
      <ProfileHeader
        accountId={communityInfo.id}
        authUserId={communityInfo.id}
        name={communityInfo.name}
        username={communityInfo.username}
        image={communityInfo.image}
        bio={communityInfo.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger className="tab" value={tab.value} key={tab.label}>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-xs:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 bg-light-4 rounded-sm px-2 py-1 !text-tiny-medium text-light-2">
                    {communityInfo.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="w-full text-light-1">
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityInfo.id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="mt-9 w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {communityInfo.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  image={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityInfo.id}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Community;
