import React from "react";
import { fetchUser, fetchUsers } from "@/lib/action/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import UserCard from "@/components/card/UserCard";
import SearchBar from "@/components/shared/SearchBar";

const Search = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ userId: user.id });
  if (!userInfo) return null;

  //Find users
  const results = await fetchUsers({
    userId: userInfo.id,
    searchString: searchParams.q,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <SearchBar routerType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {results.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {results.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                username={user.username}
                name={user.name}
                imgUrl={user.image}
                personType={"User"}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Search;
