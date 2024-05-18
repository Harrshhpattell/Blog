import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer"
import http from "http"; // Import http module
import { Server } from "socket.io";  // Import Socket.IO module
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), function (req, res) {
    res.status(200).json({ message: "Image has been uploaded.", filename: req.file.filename });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// ***************** socket io (start) ******************

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// io.on('connection', (socket) => {
//     console.log('A client connected', socket.id);
//     socket.on('disconnect', () => {
//         console.log('A client disconnected');
//     });
// });

io.on('connection', (socket) => {
    console.log('A client connected', socket.id);
    // Listen for the "joinRoom" event
    socket.on("joinRoomForNotification", (userId) => {
        console.log(`User ${userId} joined room`);
        
        // Join the room based on the user ID
        socket.join(userId);

        // Emit an event to confirm that the client joined the room
        socket.emit("notificationRoomJoined", userId);
    });
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

export { io };

// ***************** socket io (end) ******************

server.listen(8800, () => {
    console.log("Connected! (8800)")
});
