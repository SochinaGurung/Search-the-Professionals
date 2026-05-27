import { uploadBufferToCloudinary } from "../middleware/imageuploader.middleware.js";
import cloudinary from "../config/cloudinary.config.js";
import User from "../models/user.model.js";


export async function uploadProfilePicture(req, res) {
  //console.log(" Inside uploadProfilePicture");
  //console.log("req.user:", req.user);
  console.log("req.file:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'profile_pics',
      public_id: `user_${req.user.userId}`,
      transformation: [
        { width: 1600, height: 1600, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.profilePicture = {
      url: result.secure_url,
      public_id: result.public_id
    };
    await user.save();

    res.json({ success: true, profilePicture: user.profilePicture });
  } catch (err) {
    console.error("❌ Error in uploadProfilePicture:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}


export async function deleteProfilePic(req, res) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.profilePicture?.public_id) {
      return res.status(400).json({ success: false, message: "No profile picture to delete" });
    }

    await cloudinary.uploader.destroy(user.profilePicture.public_id);

    user.profilePicture = {
      url: "",
      public_id: ""
    };
    await user.save();

    res.json({ success: true, message: "Profile picture deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteProfilePic:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
