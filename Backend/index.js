// Initialization
import app from './app.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import Message from './models/message.model.js';
import Conversation from './models/conversation.model.js';

dotenv.config();

const port = process.env.PORT || 3000;

// routes
app.get('/', (_req, res) => {
    res.send("This is homepage.");
});

// Create HTTP server for socket.io
const server = http.createServer(app);

// --- SOCKET.IO SETUP ---
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    },
});

// --- ENVIRONMENT VARIABLES VALIDATION ---
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("ERROR: MONGODB_URI is not defined in environment variables!");
    console.error("Please create a .env file with MONGODB_URI set to your MongoDB connection string.");
    process.exit(1);
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error("ERROR: JWT_SECRET is not defined in environment variables!");
    console.error("Please create a .env file with JWT_SECRET set to a secure random string.");
    process.exit(1);
}

// --- MONGODB CONNECTION ---

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
        
        // Starting the server only after MongoDB connection is established
        server.listen(port, () => {
            console.log(`Server started at PORT: ${port}`);
        });
        
        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Please stop the other process or use a different port.`);
            } else {
                console.error('Server error:', error);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        console.error("Please check your MONGODB_URI in the .env file.");
        process.exit(1);
    }
}
run().catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});

// Store online users
let users = [];

const addUser = (userId, socketId) => {
    if (!users.some(u => u.userId === userId)) {
        users.push({ userId, socketId });
    }
};

const getUser = (userId) => {
    return users.find(u => u.userId === userId);
};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // When a user joins chat
    socket.on("join", (userId) => {
        if (!userId || typeof userId !== 'string') {
            console.error("Invalid userId received in join event:", userId);
            return;
        }
        addUser(userId, socket.id);
        console.log("Online users:", users);
    });

    // When sending a message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
        try {
            // Validate input
            if (!senderId || !receiverId || !text) {
                socket.emit("messageError", { error: "Missing required fields: senderId, receiverId, or text" });
                return;
            }
            if (typeof text !== 'string' || text.trim().length === 0) {
                socket.emit("messageError", { error: "Message text cannot be empty" });
                return;
            }
            
            // Get or create conversation
            let conversation = await Conversation.findOne({
                members: { $all: [senderId, receiverId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    members: [senderId, receiverId]
                });
            }

            // Save message to MongoDB
            const newMessage = await Message.create({
                conversationId: conversation._id.toString(),
                sender: senderId,
                text: text
            });

            // Prepare message data for frontend
            // Frontend expects 'from' to be the sender's ID
            const messageData = {
                from: senderId,  // This is the sender's ID
                text: text,
                createdAt: newMessage.createdAt || new Date()
            };

            // Send to receiver if online (regardless of which profile they're viewing)
            const receiver = getUser(receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit("getMessage", {
                    ...messageData,
                    conversationId: conversation._id.toString()
                });
            }

            // Also send confirmation back to sender so they see their own message
            socket.emit("getMessage", {
                ...messageData,
                conversationId: conversation._id.toString()
            });

            console.log("Message saved and sent:", newMessage._id);
        } catch (error) {
            console.error("Error saving/sending message:", error);
            socket.emit("messageError", { error: "Failed to send message" });
        }
    });

    // When disconnecting
    socket.on("disconnect", () => {
        users = users.filter(u => u.socketId !== socket.id);
        console.log("User disconnected. Online users:", users);
    });
});
