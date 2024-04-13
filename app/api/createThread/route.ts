import { Community } from "@/lib/models/community.model";
import Thread from "@/lib/models/thread.model";
import { User } from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { text, author, communityId, path, image = "" } = await req.json();
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

    return NextResponse.json({ message: "Success create thread" });
  } catch (error: any) {
    throw new Error(`Fail to create thread ${error.message}`);
  } finally {
    session.endSession();
  }
}
