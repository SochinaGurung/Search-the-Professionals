import express from "express";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const router = express.Router();

// Send a message
router.post("/", async (req, res) => {
  const { conversationId, sender, text } = req.body;

  // Validate required fields
  if (!conversationId || !sender || !text) {
    return res.status(400).json({ message: "Missing required fields: conversationId, sender, and text are required" });
  }

  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ message: "Message text cannot be empty" });
  }

  try {
    const message = new Message({ conversationId, sender, text });
    const saved = await message.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving message", error: err.message });
  }
});

// Get messages between two users (by user IDs) - This should come before /conversation/:id
router.get("/users/:userId1/:userId2", async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    if (!userId1 || !userId2) {
      return res.status(400).json({ message: "Both userId1 and userId2 are required" });
    }
    
    // Find conversation between these two users
    const conversation = await Conversation.findOne({
      members: { $all: [userId1, userId2] }
    });

    if (!conversation) {
      return res.status(200).json([]); // No conversation yet, return empty array
    }

    const msgs = await Message.find({
      conversationId: conversation._id.toString()
    }).sort({ createdAt: 1 });

    // Transform messages to match frontend format
    const formattedMessages = msgs.map(msg => ({
      from: msg.sender,
      text: msg.text,
      createdAt: msg.createdAt
    }));

    res.status(200).json(formattedMessages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

// Get messages of a conversation by conversationId
router.get("/conversation/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    const msgs = await Message.find({
      conversationId: conversationId
    }).sort({ createdAt: 1 });

    res.status(200).json(msgs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

export default router;
