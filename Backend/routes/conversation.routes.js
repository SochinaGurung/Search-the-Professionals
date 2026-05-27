import express from "express";
import Conversation from "../models/conversation.model.js";

const router = express.Router();

// Create or get an existing conversation
router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Validate required fields
  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Missing required fields: senderId and receiverId are required" });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ message: "senderId and receiverId cannot be the same" });
  }

  try {
    let convo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (!convo) {
      convo = await Conversation.create({
        members: [senderId, receiverId]
      });
    }

    res.status(200).json(convo);

  } catch (err) {
    res.status(500).json({ message: "Error creating/finding conversation", error: err.message });
  }
});

// Get all conversations for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const conversations = await Conversation.find({
      members: { $in: [userId] }
    }).sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations", error: err.message });
  }
});

export default router;
