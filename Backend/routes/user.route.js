import { Router } from "express";
import { getUserList, searchUsers, profile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
//import User from "../models/user.model.js";
import {profileForm} from '../controllers/user.controller.js';
import { uploadProfilePicture } from "../controllers/profilepicture.controller.js";

const router = Router();

router.get('/getUserList', authMiddleware, getUserList);
router.get('/searchUsers', authMiddleware, searchUsers);
router.put('/profile/:id',authMiddleware,profile);
router.get('/profile/:id',authMiddleware,profile);
router.post('/profileForm',authMiddleware, profileForm);
router.post('/experience/:id',authMiddleware,profile);
//router.patch('/uploadProfilePic', checkToken, upload.single('image').uploadProfilePicture);
//router.delete('/deleteProfilePic',checkToken.deleteProfilePic);

export default router;
