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

export type ThreadDetail = {
  _id: string;
  text: string;
  parentId: string | null;
  author: {
    name: string;
    image: string;
    id: string;
    _id: string;
  };
  community: {
    _id: string;
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  children: {
    author: {
      image: string;
    };
  }[];
  image: string;
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
  _id: string;
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
