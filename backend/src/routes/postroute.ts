// import { Router } from "express";
// import { createPostController } from "../controllers/postcontroller";


// const router = Router();

// router.post("/posts", createPostController);

// export default router;

import { Router } from "express";

import {
    createPostController,
    getPostsController,
    updatePostController,
    deletePostController
} from "../controllers/postController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Public: anyone can read posts
router.get("/posts", getPostsController);

// Protected: authentication required
router.post("/posts", authMiddleware, createPostController);
router.patch("/posts/:id", authMiddleware, updatePostController);
router.delete("/posts/:id", authMiddleware, deletePostController);

export default router;