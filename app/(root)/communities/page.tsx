import CommunityCard from "@/components/card/CommunityCard";
import SearchBar from "@/components/shared/SearchBar";
import { fetchCommunities } from "@/lib/action/community.action";
import { fetchUser } from "@/lib/action/user.action";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import { string } from "zod";

const Communitines = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ userId: user.id });
  if (!userInfo) return null;

  const results = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: 1,
    pageSize: 20,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      <SearchBar routerType="communities" />

      <div className="flex flex-wrap mt-9 gap-4">
        {results?.communities.length === 0 ? (
          <p className="no-result ml-2">No result</p>
        ) : (
          <>
            {results?.communities.map((community) => (
              <CommunityCard
                id={community.id}
                username={community.username}
                name={community.name}
                bio={community.bio}
                image={community.image}
                members={community.members}
                key={community.key}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Communitines;
