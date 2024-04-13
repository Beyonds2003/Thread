"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { User } from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import { Community } from "../models/community.model";
import mongoose from "mongoose";

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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const communityObject = await Community.findOne({
      id: communityId,
    }).session(session);

    const createThread = await Thread.create({
      text,
      author,
      community: communityObject,
      image,
    });

    //Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    }).session(session);

    //Update Community model
    if (communityObject) {
      await Community.findByIdAndUpdate(communityObject, {
        $push: { threads: createThread._id },
      }).session(session);
    }

    await session.commitTransaction();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Fail to create thread ${error.message}`);
  } finally {
    session.endSession();
  }
}

export async function deleteThread(
  threadId: string,
  author: string,
  communityId: string | undefined,
  path: string,
) {
  connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find thread to delete
    const thread = await Thread.findById(threadId).session(session);

    if (!thread) {
      throw new Error("Thread not found!!!");
    }

    // Delte Thred
    await Thread.deleteOne({ _id: threadId, author }).session(session);

    // Remove threadId from User model arry
    await User.findByIdAndUpdate(author, {
      $pull: { threads: threadId },
    }).session(session);

    // Remove threadId from Community model arry
    if (communityId) {
      await Community.findByIdAndUpdate(communityId, {
        $pull: { threads: threadId },
      }).session(session);
    }

    await session.commitTransaction();
  } catch (error: any) {
    throw new Error(`Fail to delete thread ${error.message}`);
  } finally {
    session.endSession();
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
  path: string,
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
