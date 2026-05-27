import { Router } from "express";
import { getUserList, searchUsers, getProfileById, updateProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import {profileForm} from '../controllers/user.controller.js';
import { upload } from '../middleware/imageuploader.middleware.js';
import { uploadProfilePicture } from "../controllers/profilepicture.controller.js";
import { deleteProfilePic } from "../controllers/profilepicture.controller.js";
const router = Router();
//const upload=multer();

router.get('/getUserList', authMiddleware, getUserList);
router.get('/searchUsers', authMiddleware, searchUsers);
router.get('/profile/:id', authMiddleware, getProfileById);
router.put('/profile/:id', authMiddleware, updateProfile);
router.post('/profileForm', authMiddleware, profileForm);
router.post('/experience/:id', authMiddleware, updateProfile);
router.patch('/uploadProfilePic', authMiddleware, upload.single('profilePicture'), uploadProfilePicture);
router.delete('/deleteProfilePic', authMiddleware, deleteProfilePic);


export default router;

