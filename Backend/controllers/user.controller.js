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

  const { fullName, address, profession, specialization, skills } = req.body;  // ✅ include address

  try {
    const profileCompleted =
      fullName?.trim() !== "" &&
      address?.trim() !== "" &&
      profession?.trim() !== "" &&
      specialization?.trim() !== "" &&
      Array.isArray(skills) &&
      skills.length > 0;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName,
        address,
        profession,
        specialization, 
        skills,
        profileCompleted,
      },
      { new: true }
    );
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Profile update error:", err); // log real error
    res.status(500).json({ message: "Error updating profile" });
  }
}

export async function profile(req, res) {
  const userId = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
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




