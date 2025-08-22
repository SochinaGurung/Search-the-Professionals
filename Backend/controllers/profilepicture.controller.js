import { uploadBufferToCloudinary } from "../middleware/imageuploader.middleware.js";
import cloudinary  from "../config/cloudinary.config.js";
import User from "../models/user.model.js";

export async function uploadProfilePicture(req, res){
    try{
        if(!req.file) throw new Error ('No file uploaded');

        const result= await uploadBufferToCloudinary(req.file.buffer,{
            folder:'profilepic',
            public_id:'user_${req.user.id}',
            transformation: [
                { width: 1600, height:1600, crop: 'fill', gravity:'auto'},
                {quality: 'auto', fetch_format:'auto'}
            ],
        });

        //saving image to mongoDB
        const user=await User.findByIdAndUpdate(
            req.user.id,
            {
                profilePicture:{
                    url:result.secure_url,
                    public_id:result.public_id
                }
            },
            {new:true}
        );
        res.json({success:true, imag:user.profilePicture});

    }catch(e){
        res.status(400).json({success:false, message:e.message});
    }
}