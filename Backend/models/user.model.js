import {Schema, model} from 'mongoose';
const userSchema = new Schema({
    username: {
        type: String,
        required:true, 
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: String,
    email:String,
    createdAt:{
        type:Date,
        default: Date.now
    }
});
const User = model('User', userSchema);

export default User;