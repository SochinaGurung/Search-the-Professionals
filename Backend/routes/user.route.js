import { Router } from "express";
import { getUserList, searchUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = Router();

router.get('/getUserList', authMiddleware, getUserList);

router.get('/searchUsers', authMiddleware, searchUsers);

// Public route - search users by query
router.get("/search", async (req, res) => {
  const usernameQuery = req.query.username?.toLowerCase() || "";

  try {
    const users = await User.find({
      username: { $regex: `^${usernameQuery}`, $options: "i" },
    });
    res.json({ users });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
