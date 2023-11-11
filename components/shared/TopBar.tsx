import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { dark } from "@clerk/themes";

const TopBar = () => {
  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src={"/assets/logo.svg"} width={28} height={28} alt="logo" />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Thread</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="hidden max-md:block">
          <SignedIn>
            <SignOutButton>
              <div className="cursor-pointer ">
                <Image
                  src={"/assets/logout.svg"}
                  width={24}
                  height={24}
                  alt="logout"
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
            baseTheme: dark,
          }}
        />
      </div>
    </nav>
  );
};

export default TopBar;
