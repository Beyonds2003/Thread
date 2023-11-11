import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  id: string;
  username: string;
  name: string;
  image: string;
  personType: string;
}

const UserCard = ({ id, username, name, image, personType }: Props) => {
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="w-[48px] h-[48px] relative">
          <Image
            src={image}
            alt="profile image"
            className="rounded-full"
            fill
          />
        </div>
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">{username}</p>
        </div>
      </div>
      <Button className="user-card_btn">View</Button>
    </article>
  );
};

export default UserCard;
