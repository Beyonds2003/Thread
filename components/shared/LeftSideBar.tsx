"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { sidebarLinks } from "../../constants/index";
import { useRouter, usePathname } from "next/navigation";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();

  return (
    <section className="leftsidebar custom-scrollbar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((data, i) => {
          const isActive =
            (pathname.includes(data.route) && data.route.length > 1) ||
            pathname === data.route;

          const route =
            data.route === "/profile" ? `/profile/${userId}` : data.route;

          return (
            <Link
              key={i}
              href={route}
              className={`leftsidebar_link ${
                isActive && "bg-primary-500"
              } items-center`}
            >
              <Image
                src={data.imgURL}
                width={28}
                height={28}
                alt={data.label}
              />
              <p className="text-light-1 max-lg:hidden">{data.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-10 flex flex-row gap-4 cursor-pointer">
        <SignedIn>
          <SignOutButton>
            <Image
              src={"/assets/logout.svg"}
              width={24}
              height={24}
              alt="logout"
            />
          </SignOutButton>
        </SignedIn>
        <p className="text-light-1 max-lg:hidden">Logout</p>
      </div>
    </section>
  );
};

export default LeftSideBar;
