"use server";

import { AuthErrorReason } from "@clerk/backend/dist/types/tokens/authStatus";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { User } from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import { Community } from "../models/community.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
  image: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
  image = "",
}: Params) {
  connectToDatabase();

  console.log("creating thread");
  try {
    const communityObject = await Community.findOne({ id: communityId });

    const createThread = await Thread.create({
      text,
      author,
      community: communityObject,
      image,
    });

    //Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    //Update Community model
    if (communityObject) {
      await Community.findByIdAndUpdate(communityObject, {
        $push: { threads: createThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Fail to create thread ${error.message}`);
  }
}

export async function fetchThread(pageNumber = 1, pageSize = 20) {
  connectToDatabase();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const getThreads = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      })
      .populate({
        path: "community",
        model: Community,
      });
    const totalThreadCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await getThreads.exec();

    const isNext = totalThreadCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Fail to fetch thread post ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  connectToDatabase();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      });

    return thread;
  } catch (error: any) {
    throw new Error(`Fail to fetch thread by id ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDatabase();

  try {
    //Find thread
    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found!!!");
    }

    const commentThread = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    thread.children.push(commentThread._id);

    await thread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Fail to add comment to thread ${error.message}`);
  }
}
