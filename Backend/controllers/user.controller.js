import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


// GET USER LIST (Authenticated)
export async function getUserList(req, res) {
    try {
        console.log(req);
        const users = await User.find().select('-password'); 

        res.status(200).json({users});
    } catch (err) {
        res.status(500).json({message: 'Server error',error: err.message});
    }
}

export async function searchUsers(req, res){
    try{
        const query=req.query.q?.toString() || "";
        const users=await User.find({
          $or:[
            {username:{$regex: query, $options: "i"} },
            {fullName:{$regex: query, $options: "i"} },
            { skills: { $regex: query, $options: "i" } },
            {profession:{$regex: query,$options:"i" }}   
          ]
        });
        res.status(200).json({message:"Search Completed",users});
    }catch(error){
        res.status(500).json({message: "Search Failed", error})
    }
};

export async function profileForm(req, res) {
  console.log("req.body >>>", req.body); 

  const { fullName, address, profession, specialization, skills, contact, linkedIn, instagram} = req.body;  

  try {
    const profileCompleted =
      fullName?.trim() !== "" &&
      address?.trim() !== "" &&
      profession?.trim() !== "" &&
      specialization?.trim() !== "" &&
      contact?.trim() !== "" &&
      Array.isArray(skills) &&
      skills.length > 0;

    const updateData = {
      fullName,
      address,
      profession,
      specialization, 
      contact,
      skills,
      profileCompleted,
    };

    // Add social media links if provided
    if (linkedIn !== undefined) {
      updateData.linkedIn = linkedIn;
    }
    if (instagram !== undefined) {
      updateData.instagram = instagram;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select('-password');
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Profile update error:", err); // log real error
    res.status(500).json({ message: "Error updating profile" });
  }
}

export async function getProfileById(req, res) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
}

export async function updateProfile(req, res) {
  const userId = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({
      message: 'Update failed',
      error: error.message
    });
  }
}




