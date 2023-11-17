"use server";

import { FilterQuery } from "mongoose";
import { Community } from "../models/community.model";
import Thread from "../models/thread.model";
import { User } from "../models/user.model";
import { connectToDatabase } from "../mongoose";

export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdBy: string
) {
  try {
    connectToDatabase();

    // Find the user that want to create community
    const user = await User.findOne({ id: createdBy });

    if (!user) {
      throw new Error("User not found");
    }

    // Create a community
    const community = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Use the mongoose ID of the user
    });

    await community.save();

    // Update the user model
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    console.log(`Error on creating community: ${error}`);
  }
}

export async function fetchCommunityDetail(id: string) {
  try {
    connectToDatabase();

    // Find the community
    const communityDetail = await Community.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);

    if (!communityDetail) {
      throw new Error("Community not found!");
    }

    return communityDetail;
  } catch (error) {
    console.log(`Error on fetching community detail: ${error}`);
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    connectToDatabase();

    // Find a community
    const community = await Community.findOne({ id }).populate({
      path: "threads",
      model: Thread,
      populate: [
        { path: "author", model: User, select: "name image id" },
        {
          path: "children",
          model: Thread,
          populate: { path: "author", model: User, select: "name image _id" },
        },
      ],
    });

    if (!community) {
      throw new Error("Community not found!");
    }

    return community;
  } catch (error) {
    console.log(`Error on fetching community post: ${error}`);
  }
}

export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "desc" | "asc";
}) {
  try {
    connectToDatabase();

    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided searchString
    const regex = new RegExp(searchString, "i");

    // Create the initial query to filter communities
    const query: FilterQuery<typeof Community> = {};

    // If the searchString is not empty, add $or operator to match either username or name
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOption = { createdAt: sortBy };

    const communities = await Community.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    const totalCommunitiesCount = await Community.countDocuments(query);

    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.log(`Error on fetching communities: ${error}`);
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectToDatabase();

    const test = await Community.find({});

    console.log("Check me add member", test);

    // find the community that want to add
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not Found!");
    }

    // find the user that want to join community
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found!");
    }

    // Check the user is already in community
    if (community.members.includes(user._id)) {
      throw new Error("User is already in community!");
    }

    // Add the userId in the members of community data
    community.members.push(user._id);
    await community.save();

    // Add the community id to user's communities data
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    console.log(`Error on adding member to community: ${error}`);
  }
}

export async function removeMemberFromCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectToDatabase();

    // Find the community that you want to remove user
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // find the user that want to remove
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found!");
    }

    // Remove user from community member data
    await Community.updateOne(
      { _id: community._id },
      { $pull: { members: user._id } }
    );

    // Remove community from user's communities data
    await User.updateOne(
      { _id: user._id },
      { $pull: { communities: community._id } }
    );

    return { success: true };
  } catch (error) {
    console.log(`Error from removing member from community: ${error}`);
  }
}

export async function updateCommunity(
  communityId: string,
  name: string,
  username: string,
  image: string,
  bio: string
) {
  try {
    connectToDatabase();

    // Find the community and update
    const community = await Community.findOneAndUpdate(
      { id: communityId },
      { username, name, bio, image }
    );

    if (!community) {
      throw new Error("Community not found");
    }

    return community;
  } catch (error) {
    console.log(`Error on updating community: ${error}`);
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectToDatabase();

    // find the community that want to delete
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // // Check the user is admin or not
    // if (community.createdBy !== userAdminId) {
    //   throw new Error("You are not authorized to delete community");
    // }

    // Delete the community
    const deleCommunity = await Community.findOneAndDelete({
      _id: community._id,
    });

    // Delete all thread associated with community
    await Thread.deleteMany({ community: communityId });

    // Find all user that associated with community
    const users = await User.find({ communities: communityId });

    const updateUserPromise = users.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromise);

    return deleCommunity;
  } catch (error) {
    console.log(`Error on deleting community ${error}`);
  }
}
