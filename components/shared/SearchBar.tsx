"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SearchBar = ({
  routerType,
}: {
  routerType: "search" | "communities";
}) => {
  const router = useRouter();
  const [searchString, setSearchString] = React.useState<string>("");

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchString) {
        router.push(`/${routerType}?q=${searchString}`);
      } else {
        router.push(`/${routerType}`);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchString, router]);

  return (
    <section>
      <div className="flex flex-row items-center gap-3 bg-dark-2 p-2 px-4 rounded-xl">
        <Image
          src="/assets/search-gray.svg"
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <input
          value={searchString}
          type={"text"}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder={`Search ${
            routerType === "search" ? "User" : "Communities"
          }`}
          className="bg-transparent p-2 no-focus text-light-1 outline-none"
        />
      </div>
    </section>
  );
};

export default SearchBar;
