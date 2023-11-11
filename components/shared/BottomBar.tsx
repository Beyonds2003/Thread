"use client";
import { sidebarLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();

  return (
    <section className="bottombar custom-scrollbar">
      <div className="bottombar_container">
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
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={data.imgURL}
                width={28}
                height={28}
                alt={data.label}
              />
              <p className="text-light-1 text-subtle-medium max-sm:hidden">
                {data.label.split(" ")[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default BottomBar;
