import {Schema, model} from 'mongoose';

const ExperienceSchema=new Schema({
    company:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    }
});  

const userSchema = new Schema({
    fullName: String,
    username: {
        type: String,
        required:true, 
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: String,
    email:String,
    address: String,
    about:{
        type: String,
        default:""
    },
    profession:{
        type:String,
        default:""
    },
    specialization:{
        type:String,
        default:""
    },
    
    skills:[String],

    experience: [ExperienceSchema],
    contact: String,
    
    createdAt:{
        type:Date,
        default: Date.now
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    linkedIn: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    }
});

const User = model('User', userSchema);

export default User;