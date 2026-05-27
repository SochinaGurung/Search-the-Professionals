import express from 'express';
import cors from 'cors'; // <-- Make sure you import cors!
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.routes.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config(); // Load environment variables

// Enable CORS with proper config
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Prefix all routes with /api
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

export default app;