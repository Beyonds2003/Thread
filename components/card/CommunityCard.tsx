import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

type Props = {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  members: {
    image: string;
  }[];
};

const CommunityCard = ({ id, name, username, image, bio, members }: Props) => {
  return (
    <article className="community-card">
      <div className="flex flex-wrap gap-3 items-center">
        <Link href={`/communities/${id}`} className="relative h-12 w-12">
          <Image
            alt="communitiy_logo"
            src={image}
            fill
            className="object-cover rounded-full"
          />
        </Link>
        <div>
          <Link href={`/communities/${id}`}>
            <h3 className="text-base-semibold text-light-1">{name}</h3>
          </Link>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <p className="mt-4 text-subtle-medium text-gray-1">{bio}</p>
      <div>
        <Link href={`/communities/${id}`}>
          <Button className="community-card_btn mt-4">View</Button>
        </Link>
        {members.length > 0 && (
          <div className="flex items-center">
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover`}
              />
            ))}
            {members.length > 3 && (
              <p className="ml-1 text-subtle-medium text-gray-1">
                {members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default CommunityCard;
