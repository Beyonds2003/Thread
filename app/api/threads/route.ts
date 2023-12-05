import { Community } from "@/lib/models/community.model";
import Thread from "@/lib/models/thread.model";
import { User } from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { pageNumber, pageSize } = await req.json();

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

    return NextResponse.json({ threads, isNext });
  } catch (error: any) {
    throw new Error(`Fail to fetch thread post ${error.message}`);
  }
}
