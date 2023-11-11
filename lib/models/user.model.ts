import mongoose from "mongoose";

interface userAttr {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
  onboarded: boolean;
}

interface userDoc extends mongoose.Document {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
  onboarded: boolean;
}

interface userModel extends mongoose.Model<userDoc> {
  build(attrs: userAttr): userDoc;
}

const userSchema = new mongoose.Schema({
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
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

userSchema.statics.build = (attrs: userAttr) => {
  return new User(attrs);
};

const User =
  mongoose.models.User ||
  mongoose.model<userDoc, userModel>("User", userSchema);

export { User };
