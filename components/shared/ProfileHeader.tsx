import Image from "next/image";
import React from "react";

import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  image,
  bio,
}: Props) => {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20">
            <Image
              src={image}
              alt="profile image"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-light-1 text-heading3-bold text-left">
              {name}
            </h2>
            <p className="text-gray-1 text-base-medium">@{username}</p>
          </div>
        </div>
        {accountId === authUserId && (
          <Link href="/onboarding">
            <Button className="user-card_btn">Edit</Button>
          </Link>
        )}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="h-0.5 w-full bg-dark-3 mt-12"></div>
    </div>
  );
};

export default ProfileHeader;
