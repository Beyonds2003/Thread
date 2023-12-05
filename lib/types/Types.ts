export type pageType = {
  threads: threadType[];
  isNext: boolean;
};

export type threadType = {
  author: Author;
  children: [];
  community: Community | null;
  createdAt: string;
  image: string;
  text: string;
  _id: string;
  parentId: string | null;
};

export type Author = {
  bio: string;
  communities: [] | string[];
  id: string;
  image: string;
  name: string;
  onboarded: boolean;
  threads: [];
  username: string;
};

export type Community = {
  bio: string;
  createdBy: string;
  id: string;
  image: string;
  members: string[];
  name: string;
  threads: [];
  username: string;
  _id: string;
};
