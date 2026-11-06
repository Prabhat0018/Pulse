import express from "express";
import pool from "./db";
import postRoutes from "./routes/postroute";
import authRoutes from "./routes/authroutes";
import "dotenv/config";
import interactionRoutes from "./routes/interactionroutes";
import notificationRoutes from "./routes/notificationroutes";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
const PORT = 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.use(express.json());
app.use(notificationRoutes);
app.use(interactionRoutes);
app.use(postRoutes);
app.use(authRoutes);

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected!");
        console.log(result.rows);
    }
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// import express from "express";
// import pool from "./db";

// const app = express();
// const PORT = 5000;

// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Hello from Pulse Backend!");
// });
// app.get("/posts", async (req, res) => {
//     try {
//         const result = await pool.query(
//             "SELECT * FROM posts ORDER BY created_at DESC"
//         );

//         res.json({
//             posts: result.rows
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Failed to fetch posts"
//         });
//     }
// });

// app.post("/posts", async (req, res) => {
//     const { content } = req.body;

//     if (!content) {
//         return res.status(400).json({
//             message: "Content is required"
//         });
//     }

//     try {
//         const result = await pool.query(
//             `INSERT INTO posts (content, user_id)
//              VALUES ($1, $2)
//              RETURNING *`,
//             [content, 1]
//         );

//         res.status(201).json({
//             message: "Post created successfully",
//             post: result.rows[0]
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Failed to create post"
//         });
//     }
// });

// pool.query("SELECT NOW()", (err, result) => {
//     if (err) {
//         console.error("Database connection failed:", err);
//     } else {
//         console.log("Database connected!");
//         console.log(result.rows);
//     }
// });
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

