import User from '../models/user.model.js';

// GET USER LIST (Authenticated)
export async function getUserList(req, res) {
    try {
        console.log(req);
        const users = await User.find().select('-password'); 

        res.status(200).json({
            message: 'User list fetched successfully',
            users: users
        });
    } catch (err) {
        res.status(500).json({message: 'Server error',error: err.message});
    }
}

export async function searchUsers(req, res){
    try{
        console.log(req)

        const query=req.query.q?.toString() || "";
        const users=await User.find({
            $or:[
            {username:{$regex: query, $options: "i"}}
            ]
        });
        res.json({users});
    }catch(error){
        res.status(500).json({message: "Search Failed", error})
    }
};
