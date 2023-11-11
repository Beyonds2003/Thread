import mongoose from "mongoose";

interface communityAttr {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  createdBy: string;
  members?: string[];
}

interface communityDoc extends mongoose.Document {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  createdBy: string;
  members: string[];
}

interface communityModel extends mongoose.Model<communityDoc> {
  build(attrs: communityAttr): communityDoc;
}

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

communitySchema.statics.build = (attrs: communityAttr) => {
  return new Community(attrs);
};

const Community =
  mongoose.models.Community ||
  mongoose.model<communityDoc, communityModel>("Community", communitySchema);

export { Community };
