import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware";

import {
    createCommentController,
    getCommentsController,
    deleteCommentController
} from "../controllers/commentController";

import {
    likePostController,
    unlikePostController,
    getPostLikesController
} from "../controllers/likecontroller";

const router = Router();

// Comments
router.post("/posts/:id/comments", authMiddleware, createCommentController);
router.get("/posts/:id/comments", getCommentsController);
router.delete("/comments/:id", authMiddleware, deleteCommentController);

// Likes
router.post("/posts/:id/like", authMiddleware, likePostController);
router.delete("/posts/:id/like", authMiddleware, unlikePostController);
router.get("/posts/:id/likes", getPostLikesController);

export default router;