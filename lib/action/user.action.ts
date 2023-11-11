"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { User } from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import sharp from "sharp";

type updateUserParams = {
  name: string;
  path: string;
  username: string;
  userId: string;
  bio: string;
  image: string;
};

export async function updateUser({
  name,
  path,
  username,
  userId,
  bio,
  image,
}: updateUserParams) {
  try {
    connectToDatabase();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        path,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser({ userId }: { userId: string }) {
  connectToDatabase();

  try {
    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Fail to fetch user ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string) {
  connectToDatabase();
  try {
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
        },
        {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },
      ],
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Fail to fetch user's threads ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  pageNumber = 1,
  pageSize = 20,
  searchString = "",
  sortBy = "desc",
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  searchString?: string;
  sortBy: SortOrder;
}) {
  connectToDatabase();

  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOption = { createdAt: sortBy };

    const totalUser = await User.countDocuments(query);

    const users = await User.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalUser > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Fail to fetch users for search: ${error.message}`);
  }
}

export async function fetchActivity({ userId }: { userId: string }) {
  connectToDatabase();
  try {
    // Find all threads created by current user
    const userThreads = await Thread.find({ author: userId });
    // Get the children (replies) ids from userThreads and make it as a single array
    const childThreads = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    // Find childThreads details
    const replies = await Thread.find({
      _id: { $in: childThreads },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Fail to fetch activity: ${error.message}`);
  }
}

export async function resizeImage({
  imageFile,
  username,
  type,
}: {
  imageFile: FormData;
  username: string;
  type: string;
}) {
  const image = imageFile.get("fileUpload");

  const convertImageToBuffer = await (image as File).arrayBuffer();

  const resizeImage = await sharp(convertImageToBuffer)
    .resize({ width: 400, height: 400 })
    .jpeg({ mozjpeg: true })
    .toFile(`${username}_profile.jpg`);

  return resizeImage;
}
