import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String], // [userA_id, userB_id]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
