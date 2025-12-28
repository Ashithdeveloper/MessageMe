import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["direct", "group"],
    },
    name: {
      type: String,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);


const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

